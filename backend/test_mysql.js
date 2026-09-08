const mysql = require('mysql2/promise');

async function test() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Sailu@123',
    database: 'etlp'
  });
  
  try {
    console.log('Testing creation with backticks...');
    await conn.query('CREATE TABLE IF NOT EXISTS test_curr (id INT, `current_time` INT)');
    
    console.log('Testing INSERT without backticks...');
    try {
      await conn.query('INSERT INTO test_curr (id, current_time) VALUES (1, 100)');
      console.log('INSERT without backticks succeeded!');
    } catch (e) {
      console.log('INSERT without backticks failed:', e.message);
    }
    
    console.log('Testing INSERT with backticks...');
    try {
      await conn.query('INSERT INTO test_curr (id, `current_time`) VALUES (2, 200)');
      console.log('INSERT with backticks succeeded!');
    } catch (e) {
      console.log('INSERT with backticks failed:', e.message);
    }

    console.log('Testing SELECT without backticks...');
    try {
      const [rows] = await conn.query('SELECT id, current_time FROM test_curr');
      console.log('SELECT without backticks succeeded:', rows);
    } catch (e) {
      console.log('SELECT without backticks failed:', e.message);
    }

    console.log('Testing SELECT with backticks...');
    try {
      const [rows] = await conn.query('SELECT id, `current_time` FROM test_curr');
      console.log('SELECT with backticks succeeded:', rows);
    } catch (e) {
      console.log('SELECT with backticks failed:', e.message);
    }

    console.log('Testing UPDATE without backticks...');
    try {
      await conn.query('UPDATE test_curr SET current_time = 300 WHERE id = 1');
      console.log('UPDATE without backticks succeeded!');
    } catch (e) {
      console.log('UPDATE without backticks failed:', e.message);
    }
    
    console.log('Testing UPDATE with backticks...');
    try {
      await conn.query('UPDATE test_curr SET `current_time` = 400 WHERE id = 1');
      console.log('UPDATE with backticks succeeded!');
    } catch (e) {
      console.log('UPDATE with backticks failed:', e.message);
    }
  } catch (err) {
    console.log('Overall test error:', err.message);
  } finally {
    await conn.query('DROP TABLE IF EXISTS test_curr');
    process.exit(0);
  }
}

test();
