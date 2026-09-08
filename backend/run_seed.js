const db = require('./config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Helper to split SQL by semicolons, accounting for quotes and skipping comments
function parseSql(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false;
        i++;
      }
      continue;
    }

    // Check for comments
    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (char === '-' && nextChar === '-') {
        lineComment = true;
        i++;
        continue;
      }
      if (char === '/' && nextChar === '*') {
        blockComment = true;
        i++;
        continue;
      }
    }

    // Handle quotes
    if (char === "'" && sql[i - 1] !== '\\') {
      if (!inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote;
    } else if (char === '"' && sql[i - 1] !== '\\') {
      if (!inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote;
    } else if (char === '`') {
      if (!inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
    }

    // Split on semicolon
    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      statements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(stmt => stmt.length > 0);
}

async function executeSqlFile(conn, filePath) {
  console.log(`Reading SQL file: ${filePath}`);
  const buffer = fs.readFileSync(filePath);
  let sql;
  
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    sql = buffer.toString('utf16le');
  } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    sql = buffer.toString('utf16be');
  } else {
    sql = buffer.toString('utf8');
  }
  
  // Clean up any potential BOM character if it wasn't stripped by toString
  if (sql.charCodeAt(0) === 0xFEFF || sql.charCodeAt(0) === 0xFFFE) {
    sql = sql.substring(1);
  }

  const statements = parseSql(sql);

  console.log(`Executing ${statements.length} statements...`);
  for (let stmt of statements) {
    try {
      await conn.query(stmt);
    } catch (err) {
      // Ignore some drop errors or warnings
      if (stmt.toLowerCase().includes('drop table') || stmt.toLowerCase().includes('set ') || stmt.toLowerCase().includes('unlock tables') || stmt.toLowerCase().includes('lock tables')) {
        console.warn(`Soft query warning: ${err.message}`);
      } else {
        throw new Error(`Failed to execute statement: "${stmt.substring(0, 150)}..." Error: ${err.message}`);
      }
    }
  }
  console.log(`Successfully completed: ${filePath}`);
}

async function main() {
  const conn = await db.getConnection();
  try {
    const etlpRoot = path.resolve(__dirname, '..');
    const etlpSchemaPath = path.join(etlpRoot, 'database', 'etlp.sql');
    const coursesDataPath = path.join(etlpRoot, 'courses_data.sql');
    const seedModulesPath = path.join(etlpRoot, 'seed_all_course_modules.sql');

    console.log('Disabling foreign key checks...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables to ensure clean schema recreation
    const tablesToDrop = [
      'video_progress',
      'notifications',
      'course_ratings',
      'certificates',
      'progress_tracking',
      'quiz_results',
      'student_answers',
      'options',
      'questions',
      'quizzes',
      'enrollments',
      'videos',
      'modules',
      'courses',
      'users'
    ];
    for (let table of tablesToDrop) {
      console.log(`Dropping table if exists: ${table}`);
      await conn.query(`DROP TABLE IF EXISTS ${table}`);
    }

    // 1. Recreate all tables
    await executeSqlFile(conn, etlpSchemaPath);

    // 2. Populate courses
    await executeSqlFile(conn, coursesDataPath);

    // 3. Populate modules and videos
    await executeSqlFile(conn, seedModulesPath);

    // 4. Create default users with hashed passwords
    console.log('Inserting default users...');
    const hashedPass = await bcrypt.hash('Sailu@123', 10);
    
    await conn.query(
      `INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)`,
      ['Sailaja', 'sailaja@gmail.com', hashedPass, 'student', 1]
    );
    await conn.query(
      `INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)`,
      ['Admin User', 'admin@gmail.com', hashedPass, 'admin', 1]
    );

    console.log('Enabling foreign key checks...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✨ Seeding and database recreation completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    try {
      await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch(e) {}
    process.exit(1);
  } finally {
    conn.release();
  }
}

main();
