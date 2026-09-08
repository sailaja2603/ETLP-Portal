// Comprehensive Detailed Course Notes Data for ETLP Courses
// Contains detailed session-by-session notes, key concepts, formulas, code snippets, and cheat sheets.

export const courseDetailedNotes = {
  quantum: {
    courseTitle: "Quantum Computing Certification Course",
    category: "Quantum Computing",
    sessions: {
      1: {
        sessionTitle: "Introduction to Quantum Computing & Qubits",
        summary: "Fundamental transition from classical binary computation to quantum state vectors and superposition.",
        sections: [
          {
            heading: "1. Classical Bits vs. Quantum Bits (Qubits)",
            content: "A classical bit can exist in only one of two deterministic states: 0 or 1. In contrast, a quantum bit (qubit) is a two-level quantum mechanical system represented by a unit state vector |ψ⟩ in a two-dimensional complex Hilbert space ℂ².",
            codeSnippet: "# Qubit State Representation in Python (Qiskit)\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\n# Qubit initialized to ground state |0⟩ by default",
            takeaways: [
              "State vector formula: |ψ⟩ = α|0⟩ + β|1⟩",
              "Normalization constraint: |α|² + |β|² = 1",
              "|α|² represents the probability of measuring state 0; |β|² represents probability of state 1."
            ]
          },
          {
            heading: "2. Physical Realization Technologies",
            content: "Physical implementations of qubits rely on microscopic quantum systems including Superconducting Transmon circuits (IBM, Google), Trapped Ions (IonQ), Photonic Waveguides, and Quantum Dots in silicon.",
            takeaways: [
              "Superconducting qubits operate at cryogenic temperatures near 15 millikelvin.",
              "Decoherence time (T1 and T2) defines how long a qubit retains quantum information before environmental noise corrupts the state."
            ]
          },
          {
            heading: "3. Matrix Representation of Basis States",
            content: "The computational basis states |0⟩ and |1⟩ are orthogonal column vectors:\n|0⟩ = [1, 0]ᵀ\n|1⟩ = [0, 1]ᵀ\nSuperposition state: |ψ⟩ = [α, β]ᵀ.",
            takeaways: [
              "Inner product ⟨0|1⟩ = 0 (orthogonality).",
              "Outer product |0⟩⟨0| acts as a projection operator onto state 0."
            ]
          }
        ]
      },
      2: {
        sessionTitle: "Bloch Sphere & Single Qubit States",
        summary: "Geometric visualization of pure single-qubit states on the unit sphere surface.",
        sections: [
          {
            heading: "1. Geometric Representation on the Bloch Sphere",
            content: "Any pure qubit state can be parameterized by spherical coordinates (θ, φ):\n|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩\nwhere 0 ≤ θ ≤ π (polar angle) and 0 ≤ φ < 2π (azimuthal angle).",
            takeaways: [
              "North Pole (θ = 0) corresponds to state |0⟩.",
              "South Pole (θ = π) corresponds to state |1⟩.",
              "Equator (θ = π/2) represents equal superposition states: |+⟩, |−⟩, |i+⟩, |i−⟩."
            ]
          },
          {
            heading: "2. Hadamard Basis States (|+⟩ and |−⟩)",
            content: "Superposition states on the X-axis of the Bloch sphere:\n|+⟩ = (|0⟩ + |1⟩)/√2\n|−⟩ = (|0⟩ − |1⟩)/√2.",
            codeSnippet: "# Applying Hadamard Gate to create equal superposition\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0) # Transforms |0⟩ -> |+⟩",
            takeaways: [
              "Hadamard gate H rotates state vector by π radians around X+Z axis.",
              "H² = I (Hadamard is its own inverse)."
            ]
          }
        ]
      },
      3: {
        sessionTitle: "Quantum Measurement & Born's Rule",
        summary: "The physics of irreversible state collapse during measurement observations.",
        sections: [
          {
            heading: "1. Born's Rule & Probability Postulate",
            content: "When measuring a qubit |ψ⟩ = α|0⟩ + β|1⟩ in the computational basis, the probability of obtaining result 0 is P(0) = |α|² and for 1 is P(1) = |β|².",
            takeaways: [
              "Measurement is a non-unitary, irreversible operation.",
              "Post-measurement state collapses to the observed eigenstate."
            ]
          }
        ]
      }
    }
  },

  cybersecurity: {
    courseTitle: "Cybersecurity Certification Course",
    category: "Cybersecurity",
    sessions: {
      1: {
        sessionTitle: "Introduction to Cybersecurity & CIA Triad",
        summary: "Fundamental concepts of confidentiality, integrity, availability, threat vectors, and risk governance.",
        sections: [
          {
            heading: "1. The CIA Triad Core Framework",
            content: "The foundation of information security consists of three core pillars:\n- Confidentiality: Protecting sensitive data from unauthorized disclosure.\n- Integrity: Safeguarding data accuracy and preventing unauthorized tampering.\n- Availability: Ensuring systems and data are accessible to authorized users when needed.",
            takeaways: [
              "Confidentiality mechanisms: AES-256 encryption, TLS 1.3, RBAC.",
              "Integrity mechanisms: SHA-256 hashing, digital signatures, HMAC.",
              "Availability mechanisms: Load balancers, redundant power, DDoS mitigation."
            ]
          },
          {
            heading: "2. Defense-in-Depth & Layered Security",
            content: "Defense-in-depth enforces multiple redundant security controls across physical, network, host, application, and data layers to eliminate single points of failure.",
            codeSnippet: "# Linux Firewall Rules (iptables example)\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT\niptables -A INPUT -j DROP # Default deny all incoming traffic",
            takeaways: [
              "Perimeter defenses (Firewalls, WAF) protect outer networks.",
              "Endpoint Protection (EDR) defends host workstations.",
              "Data encryption protects information at rest and in transit."
            ]
          }
        ]
      },
      2: {
        sessionTitle: "Core Security Principles & OWASP Top 10",
        summary: "Detailed breakdown of common web vulnerabilities, exploit vectors, and remediation controls.",
        sections: [
          {
            heading: "1. OWASP Top 10 Web Vulnerabilities",
            content: "1. Broken Access Control (Unauthorized data access)\n2. Cryptographic Failures (Weak ciphers, cleartext transmission)\n3. Injection Attacks (SQLi, Command Injection, XSS)\n4. Insecure Design (Lack of threat modeling during architecture phase)",
            codeSnippet: "// Preventing SQL Injection using Parameterized Queries (Node.js/MySQL2)\nconst [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [userEmail]);",
            takeaways: [
              "Always sanitize and validate user input on the server side.",
              "Enforce Least Privilege and Role-Based Access Control (RBAC)."
            ]
          }
        ]
      }
    }
  },

  iot: {
    courseTitle: "Internet of Things (IoT) Workshop",
    category: "IoT",
    sessions: {
      1: {
        sessionTitle: "IoT System Architecture & Sensory Protocols",
        summary: "End-to-end framework connecting physical hardware sensors to cloud analytics platforms.",
        sections: [
          {
            heading: "1. The 4-Layer IoT Architecture Model",
            content: "1. Sensing & Actuation Layer (Sensors, ESP32, Raspberry Pi)\n2. Network Gateway Layer (Wi-Fi, Cellular, LoRaWAN, BLE)\n3. Middleware & Storage Layer (MQTT Broker, InfluxDB, Node-RED)\n4. Application Layer (Dashboards, Mobile Apps, Predictive Analytics)",
            codeSnippet: "// ESP32 Arduino C++ MQTT Telemetry Setup\n#include <WiFi.h>\n#include <PubSubClient.h>\nWiFiClient espClient;\nPubSubClient client(espClient);",
            takeaways: [
              "Sensors convert physical phenomena (temperature, pressure) into electrical signals.",
              "Actuators perform physical actions (relays, motors, valves) based on cloud commands."
            ]
          }
        ]
      }
    }
  },

  ai: {
    courseTitle: "AI Tools Course",
    category: "AI",
    sessions: {
      1: {
        sessionTitle: "Generative AI Landscape & Prompt Engineering",
        summary: "Mastering Large Language Models, prompt strategies, and AI workflow automation.",
        sections: [
          {
            heading: "1. Prompt Engineering Strategies",
            content: "Structured prompt design improves LLM output accuracy. Key frameworks include System Persona Setting, Few-Shot Demonstrations, and Chain-of-Thought (CoT) reasoning.",
            codeSnippet: "# Chain-of-Thought Prompt Pattern\nSystem: You are an expert code auditor.\nUser: Audit this function step-by-step: 1. Check bounds, 2. Check nulls, 3. Analyze complexity.",
            takeaways: [
              "Zero-shot: Direct instruction without examples.",
              "Few-shot: Providing 2-3 input/output pairs in the prompt.",
              "Chain-of-thought: Instructing the model to 'think step-by-step'."
            ]
          }
        ]
      }
    }
  }
};

export const getDetailedCourseNotes = (courseTitle = "", sessionNum = 1) => {
  const titleLower = (courseTitle || "").toLowerCase();
  let key = "cybersecurity";

  if (titleLower.includes("quantum")) key = "quantum";
  else if (titleLower.includes("iot") || titleLower.includes("internet of things")) key = "iot";
  else if (titleLower.includes("ai") || titleLower.includes("machine")) key = "ai";

  const courseGroup = courseDetailedNotes[key];
  const sNum = parseInt(sessionNum, 10) || 1;
  const sessionData = courseGroup.sessions[sNum] || courseGroup.sessions[1];

  return {
    courseTitle: courseGroup.courseTitle,
    category: courseGroup.category,
    sessionTitle: sessionData.sessionTitle,
    summary: sessionData.summary,
    sections: sessionData.sections
  };
};
