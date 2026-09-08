const db = require("../config/db");
const axios = require("axios");
require("dotenv").config();

// Helper function to call Gemini API
const callGemini = async (prompt, systemInstruction = "") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Fallback to mock
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }
    return null;
  } catch (error) {
    console.error("Gemini API call failed, using mock fallback:", error.message);
    return null;
  }
};

const getSmartMockResponse = (message, courseTitle = "") => {
  const query = message.toLowerCase();

  // Quantum Computing Keywords
  if (query.includes("qubit") || query.includes("quantum bit")) {
    return `### ⚛️ What is a Qubit?\n\nA **qubit** (quantum bit) is the basic unit of quantum information, analogous to the classical bit. Unlike a classical bit which can only be in state **0** or **1**, a qubit can exist in a **superposition** of both states simultaneously, represented mathematically as:\n\n$$\\psi = \\alpha|0\\rangle + \\beta|1\\rangle$$\n\nwhere $\\alpha$ and $\\beta$ are complex numbers representing probability amplitudes, satisfying $|\\alpha|^2 + |\\beta|^2 = 1$.\n\n* **Bloch Sphere**: A geometrical representation of the pure state space of a single qubit.\n* **Physical Realizations**: Superconducting circuits, trapped ions, or silicon quantum dots.`;
  }
  if (query.includes("superposition")) {
    return `### 🌀 Quantum Superposition\n\n**Superposition** is a fundamental principle of quantum mechanics that allows a physical system (like a qubit) to be in multiple states at the same time. \n\n* **How it works**: A qubit remains in a combination of $|0\\rangle$ and $|1\\rangle$ until it is measured.\n* **Measurement**: Upon measurement, the superposition collapses into a classical state ($|0\\rangle$ or $|1\\rangle$) with probabilities determined by the amplitudes $|\\alpha|^2$ and $|\\beta|^2$.\n* **Gate**: The **Hadamard (H) gate** is commonly used to put a qubit into an equal superposition state:\n\n$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$$`;
  }
  if (query.includes("entanglement")) {
    return `### 🔗 Quantum Entanglement\n\n**Entanglement** is a phenomenon where two or more quantum particles become interconnected. The state of one particle instantly determines the state of the other, regardless of the distance separating them (what Einstein called *"spooky action at a distance"*).\n\n* **Bell States**: The four maximally entangled states of two qubits. For example:\n  $$\\Phi^+ = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$\n* **Creation**: Entanglement is created in a quantum circuit by applying a **Hadamard gate** to a control qubit, followed by a **CNOT (Controlled-NOT) gate** targeting a second qubit.`;
  }
  if (query.includes("gate") || query.includes("cnot") || query.includes("hadamard")) {
    return `### 🎛️ Quantum Gates\n\nQuantum gates are the building blocks of quantum circuits, represented by **unitary matrices** ($U U^\\dagger = I$). They modify the state of qubits:\n\n1. **Hadamard (H)**: Creates superposition. Maps $|0\\rangle \\rightarrow \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$.\n2. **Pauli-X**: Quantum NOT gate. Flips $|0\\rangle \\leftrightarrow |1\\rangle$.\n3. **Pauli-Z**: Flips the phase of state $|1\\rangle$ ($|1\\rangle \\rightarrow -|1\\rangle$).\n4. **CNOT (Controlled-NOT)**: Flips the target qubit if the control qubit is in state $|1\\rangle$, creating entanglement.\n\n\`\`\`python\n# Qiskit Example: Entangling 2 Qubits\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)     # Hadamard on qubit 0\nqc.cx(0, 1) # CNOT: qubit 0 controls qubit 1\nqc.draw('text')\n\`\`\``;
  }
  if (query.includes("shor") || query.includes("grover") || query.includes("algorithm")) {
    return `### 🧮 Quantum Algorithms\n\nQuantum computers leverage quantum properties to solve specific problems exponentially faster than classical computers:\n\n* **Shor's Algorithm**: Factors large integers in polynomial time ($O((\\log N)^3)$). It poses a direct threat to modern public-key cryptography (RSA).\n* **Grover's Search Algorithm**: Searches an unsorted database of $N$ items in $O(\\sqrt{N})$ time. It provides a quadratic speedup over classical linear search ($O(N)$).\n* **Deutsch-Jozsa**: Determines if a black-box function is constant or balanced in a single query.`;
  }
  if (query.includes("qiskit")) {
    return `### ⚛️ Qiskit Framework\n\n**Qiskit** is an open-source software development kit (SDK) created by IBM for working with quantum computers at the level of circuits, pulses, and algorithms.\n\n\`\`\`python\n# Basic Qiskit Circuit\nfrom qiskit import QuantumCircuit\nfrom qiskit_aer import Aer\n\nqc = QuantumCircuit(1, 1)\nqc.h(0) # Put qubit 0 in superposition\nqc.measure(0, 0) # Measure qubit 0 into classical bit 0\n\nsimulator = Aer.get_backend('qasm_simulator')\njob = simulator.run(qc, shots=1000)\nresult = job.result()\nprint("Counts:", result.get_counts(qc))\n\`\`\``;
  }

  // Cybersecurity Keywords
  if (query.includes("cia triad") || query.includes("confidentiality")) {
    return `### 🛡️ The CIA Triad\n\nThe **CIA Triad** is the core foundational model for information security:\n\n1. **Confidentiality**: Ensuring that sensitive information is accessed only by authorized parties. (Enforced via cryptography, access control lists, and MFA).\n2. **Integrity**: Protecting data from unauthorized modification or deletion. (Enforced via hashing, digital signatures, and version control).\n3. **Availability**: Guaranteeing that systems and data are accessible to authorized users when needed. (Enforced via backups, redundant servers, and DDoS mitigation).`;
  }
  if (query.includes("firewall") || query.includes("ids") || query.includes("ips")) {
    return `### 🧱 Network Defense Essentials\n\n* **Firewall**: Filters incoming and outgoing network traffic based on predefined security rules. Can be packet-filtering, stateful, or Next-Generation (NGFW).\n* **IDS (Intrusion Detection System)**: Monitors network traffic for suspicious activity and alerts administrators (passive defense).\n* **IPS (Intrusion Prevention System)**: Actively intercepts and blocks network traffic that matches threat signatures (active defense).\n* **DMZ (Demilitarized Zone)**: A physical or logical subnetwork that exposes external-facing services (like web servers) to the untrusted internet while keeping the internal network protected.`;
  }
  if (query.includes("phishing") || query.includes("social engineering")) {
    return `### 📧 Phishing & Social Engineering\n\n**Social Engineering** exploits human psychology rather than software vulnerabilities to gain unauthorized access:\n\n* **Phishing**: Mass emails sent to users pretending to be from trusted entities to steal credentials or deliver malware.\n* **Spear Phishing**: Targeted phishing attacks aimed at a specific individual or organization.\n* **Whaling**: Phishing campaigns targeting high-profile corporate executives (C-level officers).\n* **Pretexting**: Creating a fabricated scenario (pretext) to persuade a victim to leak information.`;
  }
  if (query.includes("ransomware") || query.includes("malware")) {
    return `### 🦠 Ransomware & Malware\n\n**Ransomware** is a type of malware that encrypts the victim's files, demanding a ransom payment (usually in cryptocurrency) to restore access with a decryption key.\n\n* **Containment Protocol**: \n  1. Immediately **disconnect** the infected device from the network (unplug ethernet, disable Wi-Fi) to stop lateral spread.\n  2. Isolate backup systems to prevent backups from being encrypted.\n  3. Engage the incident response team and preserve logs for forensic analysis.`;
  }
  if (query.includes("ddos") || query.includes("denial of service")) {
    return `### 🌊 Distributed Denial of Service (DDoS)\n\nA **DDoS** attack attempts to make an online service unavailable by overwhelming it with traffic from multiple distributed sources, typically a **botnet** (compromised computers/IoT devices controlled by hackers).\n\n* **Mitigation strategies**:\n  * Implementing rate-limiting on routers and load balancers.\n  * Using content delivery networks (CDNs) to absorb high traffic volume.\n  * Deploying Web Application Firewalls (WAF) to filter malicious requests.`;
  }
  if (query.includes("sql injection") || query.includes("sqli")) {
    return `### 💉 SQL Injection (SQLi)\n\n**SQL Injection** occurs when malicious SQL statements are inserted into entry fields (like login forms) to execute unauthorized commands on the database.\n\n* **Vulnerable Query example**:\n  \`SELECT * FROM users WHERE username = '\` + input + \`';\` (Inputting \`admin' OR '1'='1\` bypasses password checks).\n* **Prevention**:\n  * Use **Parameterized Queries** (Prepared Statements).\n  * Apply input validation and sanitization.\n  * Restrict database account permissions (Least Privilege).`;
  }
  if (query.includes("xss") || query.includes("cross site scripting")) {
    return `### 🌐 Cross-Site Scripting (XSS)\n\n**XSS** occurs when a web application injects malicious client-side script code (usually JavaScript) into a trusted webpage viewed by other users.\n\n* **Stored XSS**: The script is permanently stored on the server (e.g. in a comment field) and executed whenever a user visits the page.\n* **Reflected XSS**: The script is reflected off the web server in response to a user request (e.g. in a search query parameter).\n* **Prevention**: HTML entity encoding, sanitizing user inputs, and implementing a strong Content Security Policy (CSP).`;
  }

  // IoT Keywords
  if (query.includes("sensor") || query.includes("actuator") || query.includes("iot")) {
    return `### 🔌 IoT Ecosystem: Sensors & Actuators\n\nIn the **Internet of Things (IoT)**, physical devices connect to the digital world:\n\n* **Sensors**: Gather data from the physical environment (e.g., temperature, humidity, pressure, light, motion) and convert it into electrical signals.\n* **Actuators**: Receive electrical signals from a controller and execute a physical action (e.g., turning on a motor, closing a valve, switching a relay, activating an LED).\n* **Microcontrollers**: The "brain" (e.g. ESP32, Arduino) that reads sensor inputs, processes the logic, and triggers actuators.`;
  }
  if (query.includes("mqtt") || query.includes("coap") || query.includes("protocol")) {
    return `### 📡 IoT Communication Protocols\n\nIoT devices require lightweight protocols designed for low-bandwidth, high-latency networks:\n\n* **MQTT (Message Queuing Telemetry Transport)**: A publish-subscribe messaging protocol. Uses a central **broker** to route messages. Runs over TCP/IP, highly reliable and standard for IoT.\n* **CoAP (Constrained Application Protocol)**: A client-server document transfer protocol designed for constrained nodes. Relies on UDP/IP, similar to a lightweight RESTful HTTP.\n* **LoRaWAN**: A Low Power, Wide Area Network protocol designed to wirelessly connect battery-operated things to the internet over long distances.`;
  }

  // AI & ML Keywords
  if (query.includes("machine learning") || query.includes("ml") || query.includes("supervised") || query.includes("unsupervised")) {
    return `### 🤖 Machine Learning Paradigms\n\nMachine Learning involves training systems to learn patterns from data:\n\n1. **Supervised Learning**: Training a model on labeled data (input-output pairs). Examples: Linear Regression, Support Vector Machines (SVM), Random Forest. Used for classification and regression.\n2. **Unsupervised Learning**: Finding hidden patterns in unlabeled data. Examples: K-Means Clustering, Principal Component Analysis (PCA). Used for segmentation and dimensionality reduction.\n3. **Reinforcement Learning**: Training an agent to make decisions by rewarding desired behaviors and punishing undesired ones.`;
  }
  if (query.includes("deep learning") || query.includes("neural network") || query.includes("transformer")) {
    return `### 🧠 Deep Learning & Transformers\n\n* **Neural Networks**: Computing systems inspired by biological brain structures, composed of layers of interconnected nodes (neurons) that process data.\n* **Deep Learning**: A subset of ML utilizing deep neural networks (many hidden layers) to extract high-level features from raw data.\n* **Transformers**: A deep learning architecture introduced in 2017 that utilizes **self-attention** mechanisms to process sequential data (like text) in parallel. It is the backbone of modern Large Language Models (LLMs) like GPT, Claude, and Gemini.`;
  }
  if (query.includes("prompt") || query.includes("llm") || query.includes("ai tool")) {
    return `### 💡 Prompt Engineering & AI Tools\n\n**Prompt Engineering** is the practice of structuring text inputs (prompts) to get the most accurate, relevant, and helpful responses from generative AI models (LLMs):\n\n* **Best Practices**:\n  * Be specific and descriptive (provide context, role, and format expectations).\n  * Use delimiters (like triple backticks or XML tags) to separate instructions from input text.\n  * Provide examples of desired output (few-shot prompting).\n  * Direct the model to "think step-by-step" for complex logic tasks.`;
  }

  // Generic Greetings
  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return `Hello! I am your AI Learning Assistant. I'm here to help you study **${courseTitle || "Emerging Technologies"}**. What questions do you have today?`;
  }
  if (query.includes("help") || query.includes("what can you do")) {
    return `I can help you understand technical concepts, write and debug code, explain lesson topics, or recommend study workflows! Ask me anything about **${courseTitle || "AI, Cybersecurity, IoT, or Quantum Computing"}**.`;
  }

  // Default fallback matching course title or generic response
  if (courseTitle) {
    return `Regarding your question about **"${message}"** in the context of **${courseTitle}**:\n\n1. **Concept Analysis**: This relates directly to the technical modules. Let me know if you want me to explain qubits, security firewalls, sensors, or neural networks.\n2. **Study Tip**: Review the session slides, try out the hands-on labs, and complete the related quizzes.\n3. **Practical Application**: Implementing these practices ensures standard industry compliance and scalable deployment.\n\nAsk me about specific topics (e.g. "what is superposition", "explain SQL injection", "what is MQTT") and I will give you a detailed explanation and code!`;
  }

  return `That's an interesting question! \n\nI am configured as an Emerging Technologies Tutor. Feel free to ask me questions about:\n* **Quantum Computing** (superposition, entanglement, qubits, gates)\n* **Cybersecurity** (CIA triad, firewalls, phishing, SQLi, XSS)\n* **IoT** (sensors, actuators, MQTT, microcontrollers)\n* **AI & Machine Learning** (transformers, deep learning, prompt engineering)\n\nAsk me a question on any of these topics and I will give you a detailed answer!`;
};

// 1. AI Chatbot
exports.chatbotResponse = async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    const { courseTitle = "", moduleTitle = "" } = context;

    let prompt = `User query: "${message}"\n`;
    if (courseTitle || moduleTitle) {
      prompt += `Current Learning Context: Course is "${courseTitle}" and Module is "${moduleTitle}". Please provide a helpful, concise answer relating to this technical domain.`;
    }

    const systemInstruction = "You are a friendly, highly intelligent AI Coding and Learning assistant on the Emerging Technologies Learning Portal (ETLP). Help students understand concepts in AI, ML, Cloud Computing, Cyber Security, Blockchain, Web/Mobile Dev, DevOps, and UI/UX. Keep explanations clear, technical, and format code snippets beautifully if requested.";

    // Try calling real Gemini API
    let answer = await callGemini(prompt, systemInstruction);

    // Fallback to high-quality smart mock responses if real call fails or returns empty
    if (!answer) {
      answer = getSmartMockResponse(message, courseTitle);
    }

    res.json({
      success: true,
      reply: answer
    });
  } catch (error) {
    console.error("Chatbot controller error:", error);
    res.status(500).json({ success: false, message: "Chatbot Error" });
  }
};

// 2. AI Video Summary Generator
exports.generateSummary = async (req, res) => {
  try {
    const { videoId, videoTitle = "this lesson", duration = "10 minutes" } = req.body;

    const prompt = `Generate a structured, professional learning summary for a video lecture titled "${videoTitle}" (Duration: ${duration}). Include 3 Key Takeaways, a 2-paragraph Summary, and 2 Study Check questions. Use markdown formatting.`;

    let summary = await callGemini(prompt);

    if (!summary) {
      summary = `### 📝 Learning Summary: **${videoTitle}**

#### 🔑 Key Takeaways
1. **Core Architecture**: Understand how this technology forms the baseline for high-performance deployments.
2. **Implementation Flow**: Learn the exact sequence of instructions required to setup and debug the environment.
3. **Common Pitfalls**: Avoid insecure protocols, unparameterized inputs, and lack of rate-limiting in routing configurations.

#### 📖 Lecture Summary
This lesson covers the fundamental models of **${videoTitle}**. It explains how to structure systems to achieve maximum availability and throughput. By reviewing real-world application examples, we establish why industry leaders prioritize these practices.

Additionally, the session highlights the integration of robust security configurations, payload encryption techniques, and role isolation protocols to safeguard enterprise data assets.

#### 🧠 Study Check
* **Question 1**: How does this mechanism differ from classic legacy systems?
* **Question 2**: What is the performance impact of caching modules locally?`;
    }

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Summary controller error:", error);
    res.status(500).json({ success: false, message: "Summary Generation Error" });
  }
};

// 3. AI Course Recommendation System
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get courses user is currently enrolled in
    const [enrolled] = await db.query(
      "SELECT course_id FROM enrollments WHERE user_id = ?",
      [userId]
    );

    const enrolledIds = enrolled.map(e => e.course_id);

    // Get all courses
    const [allCourses] = await db.query("SELECT * FROM courses");

    let recommended = [];

    if (enrolledIds.length === 0) {
      // If not enrolled in any, recommend trending courses (just slice first 3)
      recommended = allCourses.slice(0, 3);
    } else {
      // Find what categories the student likes
      const [userCategories] = await db.query(
        `SELECT DISTINCT category FROM courses WHERE id IN (${enrolledIds.length > 0 ? enrolledIds.join(",") : "0"})`
      );
      const categories = userCategories.map(c => c.category);

      // Recommend courses from same categories or general complementary ones that the user is not enrolled in
      recommended = allCourses.filter(c => !enrolledIds.includes(c.id));
      
      // Sort by category match (put matching categories first)
      recommended.sort((a, b) => {
        const aMatch = categories.includes(a.category) ? 1 : 0;
        const bMatch = categories.includes(b.category) ? 1 : 0;
        return bMatch - aMatch;
      });

      // Take top 3
      recommended = recommended.slice(0, 3);
    }

    res.json({
      success: true,
      recommendations: recommended
    });
  } catch (error) {
    console.error("Recommendation controller error:", error);
    res.status(500).json({ success: false, message: "Recommendations Error" });
  }
};
