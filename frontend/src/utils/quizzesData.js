export const getSessionTitle = (courseTitle, sessionNum) => {
  const titleLower = (courseTitle || "").toLowerCase();
  const index = parseInt(sessionNum, 10) - 1;

  if (titleLower.includes("quantum")) {
    const quantumTitles = [
      "Introduction to Quantum Computing & Qubits",
      "Bloch Sphere & Single Qubit States",
      "Quantum Measurement & Probability",
      "Single Qubit Gates (Hadamard, Pauli X, Y, Z)",
      "Multi-Qubit Systems & Entanglement",
      "Entanglement, Bell States & CNOT",
      "Quantum Circuit Simulation Basics",
      "Qiskit & IBM Quantum Platform",
      "Quantum Protocols (Teleportation, Coding)",
      "Deutsch-Jozsa & Grover's Search Algorithms",
      "Shor's Factoring Algorithm",
      "Quantum Cryptography & BB84",
      "Quantum Hardware & Error Correction"
    ];
    return quantumTitles[index] ? `Session ${sessionNum}: ${quantumTitles[index]}` : `Session ${sessionNum}`;
  }

  if (titleLower.includes("cybersecurity")) {
    const cyberTitles = [
      "Introduction to Cybersecurity",
      "Core Security Principles",
      "Threats and Vulnerabilities",
      "Network Defense Essentials",
      "Identity and Access Control",
      "Incident Response Basics"
    ];
    return cyberTitles[index] ? `Session ${sessionNum}: ${cyberTitles[index]}` : `Session ${sessionNum}`;
  }

  return `Session ${sessionNum}`;
};

export const getSessionQuizQuestions = (courseTitle, sessionNum) => {
  const titleLower = (courseTitle || "").toLowerCase();
  const sNum = parseInt(sessionNum, 10) || 1;

  if (titleLower.includes("quantum")) {
    const quantumQuizzes = {
      1: [
        { q: "Who originally proposed the concept of a quantum computer?", opts: ["Richard Feynman", "Albert Einstein", "Alan Turing", "Stephen Hawking"], ans: 0 },
        { q: "What is the basic unit of quantum information?", opts: ["Bit", "Qubit", "Byte", "Qubyte"], ans: 1 },
        { q: "Which property allows quantum systems to exist in multiple states simultaneously?", opts: ["Superposition", "Entanglement", "Decoherence", "Interference"], ans: 0 },
        { q: "What mathematical framework represents a qubit's state vector?", opts: ["Hilbert space", "Euclidean space", "Minkowski space", "Banach space"], ans: 0 },
        { q: "What is the vector representation of the ground state |0⟩?", opts: ["[1, 0]^T", "[0, 1]^T", "[1, 1]^T", "[1, -1]^T"], ans: 0 },
        { q: "What is the vector representation of the excited state |1⟩?", opts: ["[1, 0]^T", "[0, 1]^T", "[1, 1]^T", "[1, -1]^T"], ans: 1 },
        { q: "A classical bit can store values 0 or 1. A qubit can store:", opts: ["Only 0", "Only 1", "An infinite number of superpositions of |0⟩ and |1⟩", "Neither 0 nor 1"], ans: 2 },
        { q: "Which of these is a physical realization of a qubit?", opts: ["Superconducting loop", "Copper wire", "Silicon transistor", "Optical fiber"], ans: 0 },
        { q: "The coefficients alpha and beta in a qubit state satisfy which normalization condition?", opts: ["alpha + beta = 1", "alpha^2 + beta^2 = 1", "|alpha|^2 + |beta|^2 = 1", "alpha * beta = 1"], ans: 2 },
        { q: "Which classical scientist's limits motivated the development of quantum computing?", opts: ["Moore's Law limits", "Newton's laws", "Maxwell's equations", "Faraday's laws"], ans: 0 }
      ],
      2: [
        { q: "Which mathematical sphere represents the state space of a single qubit?", opts: ["Bloch Sphere", "Riemann Sphere", "Fermi Sphere", "Euler Sphere"], ans: 0 },
        { q: "The poles of the Bloch Sphere represent which states?", opts: ["|+⟩ and |−⟩", "|0⟩ and |1⟩", "|i+⟩ and |i−⟩", "Ground and mixed states"], ans: 1 },
        { q: "What do points on the surface of the Bloch Sphere represent?", opts: ["Pure states", "Mixed states", "Entangled states", "Superdense states"], ans: 0 },
        { q: "What do points inside the Bloch Sphere represent?", opts: ["Pure states", "Mixed states", "Entangled states", "Superdense states"], ans: 1 },
        { q: "The angle theta (θ) in the Bloch Sphere representation determines:", opts: ["Relative phase", "Superposition amplitude ratio", "Entanglement quality", "Measurement probability"], ans: 1 },
        { q: "The angle phi (φ) in the Bloch Sphere representation determines:", opts: ["Relative phase", "Superposition amplitude ratio", "Entanglement quality", "Measurement probability"], ans: 0 },
        { q: "The state |+⟩ is represented at which coordinate on the Bloch Sphere?", opts: ["Positive X-axis", "Negative X-axis", "Positive Z-axis", "Negative Z-axis"], ans: 0 },
        { q: "The state |−⟩ is represented at which coordinate on the Bloch Sphere?", opts: ["Positive X-axis", "Negative X-axis", "Positive Z-axis", "Negative Z-axis"], ans: 1 },
        { q: "The states |i+⟩ and |i−⟩ lie on which axis of the Bloch Sphere?", opts: ["X-axis", "Y-axis", "Z-axis", "W-axis"], ans: 1 },
        { q: "What is the radius of the Bloch Sphere?", opts: ["0.5", "1", "2", "Infinity"], ans: 1 }
      ],
      3: [
        { q: "Measuring a qubit in superposition collapses it to:", opts: ["A deterministic state (|0⟩ or |1⟩)", "Another superposition state", "A complex matrix", "Infinity"], ans: 0 },
        { q: "What mathematical construct represents quantum measurement operators?", opts: ["Hermitian Matrices", "Identity Matrices", "Singular Matrices", "Null Matrices"], ans: 0 },
        { q: "According to Born's rule, the probability of measuring state |0⟩ from state alpha|0⟩ + beta|1⟩ is:", opts: ["alpha", "beta", "|alpha|^2", "|beta|^2"], ans: 2 },
        { q: "What is the state of a qubit immediately after measurement?", opts: ["Completely random", "The state corresponding to the measurement result", "Mixed superposition", "Ground state always"], ans: 1 },
        { q: "Measurement in quantum mechanics is generally:", opts: ["Reversible", "Irreversible", "Deterministic", "Predictable"], ans: 1 },
        { q: "What is the expectation value of a quantum operator?", opts: ["The average of results of repeated measurements", "The highest value possible", "The lowest value possible", "Zero"], ans: 0 },
        { q: "Which base is the standard computational measurement base?", opts: ["X-basis", "Y-basis", "Z-basis", "Hadamard basis"], ans: 2 },
        { q: "The X-basis consists of which states?", opts: ["|0⟩ and |1⟩", "|+⟩ and |−⟩", "|i+⟩ and |i−⟩", "All pure states"], ans: 1 },
        { q: "What happens if you measure a qubit in state |+⟩ in the Z-basis?", opts: ["Always 0", "Always 1", "50% chance of |0⟩, 50% chance of |1⟩", "It remains in |+⟩"], ans: 2 },
        { q: "What is the sum of probabilities of all possible measurement outcomes?", opts: ["0.5", "1.0", "2.0", "Complex unit"], ans: 1 }
      ],
      4: [
        { q: "Which single-qubit quantum gate creates equal superposition from state |0⟩?", opts: ["Pauli-X", "Hadamard (H)", "Pauli-Z", "CNOT"], ans: 1 },
        { q: "What is the action of the Pauli-X gate?", opts: ["Applies a phase shift", "Acts as a quantum NOT gate", "Measures the qubit", "Creates entanglement"], ans: 1 },
        { q: "What does the Pauli-Z gate do?", opts: ["Flips the phase of state |1⟩", "Swaps two qubits", "Acts as a NOT gate", "Sets qubit to 0"], ans: 0 },
        { q: "Applying the Hadamard gate twice to a qubit in state |0⟩ results in:", opts: ["|1⟩", "|+⟩", "|0⟩", "|−⟩"], ans: 2 },
        { q: "The Pauli-Y gate is equivalent to:", opts: ["Bit flip only", "Phase flip only", "A combination of bit flip and phase flip", "Measurement"], ans: 2 },
        { q: "What is the matrix representation of the Hadamard gate?", opts: ["[[1, 0], [0, 1]]", "[[0, 1], [1, 0]]", "1/sqrt(2) * [[1, 1], [1, -1]]", "[[1, 0], [0, -1]]"], ans: 2 },
        { q: "Quantum gates must be represented by what kind of matrices?", opts: ["Unitary matrices", "Hermitian matrices", "Singular matrices", "Orthogonal only"], ans: 0 },
        { q: "A unitary matrix U satisfies which property?", opts: ["U = U^T", "U * U^dagger = I", "U = 0", "det(U) = 0"], ans: 1 },
        { q: "Which gate rotates a qubit by 90 degrees around the Z-axis?", opts: ["S gate", "T gate", "Hadamard gate", "X gate"], ans: 0 },
        { q: "Which gate is also called the pi/8 gate?", opts: ["S gate", "T gate", "X gate", "Z gate"], ans: 1 }
      ],
      5: [
        { q: "Which gate is commonly used to create quantum entanglement between two qubits?", opts: ["Hadamard Gate", "Pauli-Y Gate", "Controlled-NOT (CNOT) Gate", "Phase Gate"], ans: 2 },
        { q: "What state is created by applying a Hadamard followed by a CNOT gate?", opts: ["Bell State", "Product State", "Ground State", "Mixed State"], ans: 0 },
        { q: "If a 2-qubit system state cannot be factored into the product of two single-qubit states, it is:", opts: ["Decohered", "Entangled", "Superposed", "Classical"], ans: 1 },
        { q: "What is the dimension of the state space of a 3-qubit system?", opts: ["3", "6", "8", "9"], ans: 2 },
        { q: "The state (|00⟩ + |11⟩)/sqrt(2) is also known as:", opts: ["Bell State Phi^+", "Bell State Psi^+", "Bell State Phi^−", "Bell State Psi^−"], ans: 0 },
        { q: "In a CNOT gate, which qubit is the target qubit?", opts: ["The first qubit always", "The second qubit always", "The qubit that is flipped depending on the control qubit", "None"], ans: 2 },
        { q: "How do you mathematically combine two separate single-qubit state vectors?", opts: ["Dot product", "Cross product", "Tensor product", "Matrix addition"], ans: 2 },
        { q: "Which of these is a product state (not entangled)?", opts: ["(|00⟩ + |11⟩)/sqrt(2)", "(|01⟩ + |10⟩)/sqrt(2)", "|01⟩", "(|00⟩ - |11⟩)/sqrt(2)"], ans: 2 },
        { q: "Which quantum gate represents the Controlled-Z operation?", opts: ["CNOT", "CZ", "SWAP", "Toffoli"], ans: 1 },
        { q: "What is the purpose of the SWAP gate?", opts: ["Entangles qubits", "Flips a single qubit", "Interchanges the states of two qubits", "Measures two qubits"], ans: 2 }
      ],
      6: [
        { q: "What is the characteristic property of Bell States?", opts: ["Zero superposition", "Maximal entanglement", "Infinite amplitude", "Classical independence"], ans: 1 },
        { q: "In a 2-qubit CNOT gate, which qubit is flipped if the control qubit is |1⟩?", opts: ["Control qubit", "Target qubit", "Both qubits", "Neither qubit"], ans: 1 },
        { q: "How many distinct orthogonal Bell states exist for a 2-qubit system?", opts: ["2", "4", "8", "16"], ans: 1 },
        { q: "The Bell state (|01⟩ - |10⟩)/sqrt(2) is also called:", opts: ["Bell triplet", "Bell singlet state", "Bell superposition", "Greenberger-Horne-Zeilinger state"], ans: 1 },
        { q: "What is the matrix dimension of a 2-qubit gate?", opts: ["2x2", "4x4", "8x8", "16x16"], ans: 1 },
        { q: "Entanglement violates which classical concept of physics?", opts: ["Local realism", "Conservation of momentum", "Gravity", "Conservation of charge"], ans: 0 },
        { q: "What theorem states that quantum entanglement cannot be used to transmit information faster than light?", opts: ["No-communication theorem", "No-cloning theorem", "Bell's theorem", "Shor's theorem"], ans: 0 },
        { q: "Which experiment is used to test local realism and show quantum violation?", opts: ["Double-slit experiment", "Bell inequality test / CHSH inequality", "Stern-Gerlach experiment", "Photoelectric experiment"], ans: 1 },
        { q: "If you measure one qubit of the state (|00⟩ + |11⟩)/sqrt(2) and get 0, the other qubit is:", opts: ["0", "1", "0 or 1 randomly", "Superposed"], ans: 0 },
        { q: "What is the result of applying a Pauli-X gate to the first qubit of the Bell state (|00⟩ + |11⟩)/sqrt(2)?", opts: ["(|01⟩ + |10⟩)/sqrt(2)", "(|11⟩ + |00⟩)/sqrt(2)", "(|10⟩ + |01⟩)/sqrt(2)", "(|00⟩ - |11⟩)/sqrt(2)"], ans: 2 }
      ],
      7: [
        { q: "What is the purpose of quantum circuit simulation?", opts: ["Testing algorithms on classical hardware", "Encrypting passwords", "Compiling JavaScript code", "Increasing CPU clock speed"], ans: 0 },
        { q: "Which gate operates as the controller in a quantum circuit?", opts: ["Target Gate", "Control Gate", "Measurement Gate", "Ancilla Gate"], ans: 1 },
        { q: "How is measurement represented in a quantum circuit diagram?", opts: ["A box with 'M'", "A meter icon", "A resistor symbol", "A capacitor symbol"], ans: 1 },
        { q: "Time in a quantum circuit flows in which direction?", opts: ["Right to left", "Left to right", "Top to bottom", "Bottom to top"], ans: 1 },
        { q: "What is an 'ancilla' qubit?", opts: ["An extra qubit used for temporary calculations", "A communication qubit", "The main processor qubit", "A noisy qubit"], ans: 0 },
        { q: "In a circuit diagram, what does a double-line wire represent?", opts: ["A quantum wire", "A classical bit wire", "A ground wire", "A high-voltage line"], ans: 1 },
        { q: "What is the depth of a quantum circuit?", opts: ["Number of total qubits", "Number of sequential gates / time slices", "Error rate of the circuit", "Simulation speed"], ans: 1 },
        { q: "What does 'quantum volume' measure?", opts: ["The physical size of the computer", "The capability and error rates of a quantum processor", "The loudness of cryogenic systems", "The memory size"], ans: 1 },
        { q: "Why are classical simulators limited in simulating large quantum circuits?", opts: ["They lack quantum electricity", "Exponential memory growth", "Compiler restrictions", "Slow network connections"], ans: 1 },
        { q: "How many complex amplitudes must a simulator store for a 30-qubit circuit?", opts: ["30", "900", "2^30 amplitudes", "30^2 amplitudes"], ans: 2 }
      ],
      8: [
        { q: "What is the main software framework used to design quantum circuits for IBM computers?", opts: ["PyTorch", "Qiskit", "TensorFlow", "Pandas"], ans: 1 },
        { q: "In quantum circuit design, what does a wire represent?", opts: ["Flow of electric current", "Evolution of a qubit over time", "A classical resistor", "A physical cable"], ans: 1 },
        { q: "Which programming language is Qiskit built on?", opts: ["C++", "Java", "Python", "JavaScript"], ans: 2 },
        { q: "Which Qiskit module is used for simulating quantum circuits?", opts: ["Aer", "Terra", "Ignis", "Aqua"], ans: 0 },
        { q: "What does the `transpile` function do in Qiskit?", opts: ["Runs code in browser", "Converts a circuit to match target hardware topology", "Deletes qubits", "Encrypts circuits"], ans: 1 },
        { q: "How do you display a circuit diagram in Qiskit?", opts: ["circuit.draw()", "print(circuit)", "circuit.show()", "draw(circuit)"], ans: 0 },
        { q: "What class represents a quantum circuit in Qiskit?", opts: ["Circuit", "QuantumCircuit", "QCircuit", "IBMCircuit"], ans: 1 },
        { q: "What is a 'shot' in quantum execution?", opts: ["A single run/repetition of the circuit", "An error code", "A hardware component", "A laser pulse"], ans: 0 },
        { q: "What is the IBM Quantum Composer?", opts: ["A graphical user interface for building quantum circuits", "A music generator", "A code compiler", "A debugger tool"], ans: 0 },
        { q: "Which provider allows execution of Qiskit code on real quantum backend hardware?", opts: ["QiskitProvider", "IBMProvider", "LocalProvider", "WebProvider"], ans: 1 }
      ],
      9: [
        { q: "What protocol transfers qubit information using entanglement and classical communication?", opts: ["Quantum Key Distribution", "Quantum Teleportation", "Grover's Search", "Superdense Coding"], ans: 1 },
        { q: "How many classical bits can be transmitted by sending one qubit in Superdense Coding?", opts: ["1 bit", "2 bits", "3 bits", "4 bits"], ans: 1 },
        { q: "Does Quantum Teleportation physically move a particle?", opts: ["Yes", "No, it only transfers the state", "Sometimes", "Only in vacuum"], ans: 1 },
        { q: "What resources are required for Quantum Teleportation?", opts: ["A shared Bell pair and 2 classical bits", "A classical cable only", "Three entangled qubits only", "A quantum laser transmitter"], ans: 0 },
        { q: "In Quantum Teleportation, what measurement does Alice perform?", opts: ["Z-basis measurement", "Bell state measurement", "X-basis measurement", "No measurement"], ans: 1 },
        { q: "In Superdense Coding, Alice applies gates to her qubit to encode how many bits?", opts: ["1 bit", "Two classical bits", "One qubit", "Four bits"], ans: 1 },
        { q: "What theorem makes quantum teleportation necessary for moving quantum states?", opts: ["No-cloning theorem", "No-communication theorem", "Bell's theorem", "Born's rule"], ans: 0 },
        { q: "What correction gates might Bob need to apply in Teleportation?", opts: ["Pauli-X, Pauli-Z, or both", "Hadamard and CNOT", "Toffoli gate", "No correction needed"], ans: 0 },
        { q: "Can teleportation exceed the speed of light?", opts: ["Yes", "No, because it requires classical communication", "Only in deep space", "Only under zero gravity"], ans: 1 },
        { q: "What is the final state of Alice's original qubit after teleportation?", opts: ["It is unchanged", "It is collapsed/destroyed by measurement", "It is entangled with Bob's", "It is set to |+⟩"], ans: 1 }
      ],
      10: [
        { q: "What kind of computational speedup does Grover's search algorithm provide?", opts: ["Linear speedup", "Quadratic speedup", "Exponential speedup", "Logarithmic speedup"], ans: 1 },
        { q: "The Deutsch-Jozsa algorithm determines whether a given function is constant or:", opts: ["Balanced", "Injective", "Periodic", "Reversible"], ans: 0 },
        { q: "Grover's algorithm is designed to solve which problem?", opts: ["Factoring primes", "Searching an unsorted database", "Sorting lists", "Solving linear equations"], ans: 1 },
        { q: "How many oracle queries does Deutsch-Jozsa require to solve its problem?", opts: ["1 query", "2 queries", "N queries", "2^N queries"], ans: 0 },
        { q: "How many queries does a classical algorithm need for Deutsch-Jozsa in the worst case?", opts: ["1", "N", "2^(N-1) + 1", "2^N"], ans: 2 },
        { q: "What operator is repeatedly applied in Grover's algorithm?", opts: ["Hadamard", "Grover diffusion operator", "CNOT operator", "Fourier operator"], ans: 1 },
        { q: "Grover's search amplitude amplification works by:", opts: ["Squaring probabilities", "Inverting amplitudes about the mean", "Flipping all qubit phases", "Decohering other states"], ans: 1 },
        { q: "If a database has N items, Grover's algorithm finds the item in approximately:", opts: ["N steps", "N/2 steps", "O(sqrt(N)) queries", "log(N) queries"], ans: 2 },
        { q: "What state is Grover's algorithm initialized to?", opts: ["|00...0⟩", "|11...1⟩", "Equal superposition of all states", "Bell state"], ans: 2 },
        { q: "Deutsch's algorithm is the N=1 version of Deutsch-Jozsa. What does it check?", opts: ["Whether a 1-bit function is constant or balanced", "Whether a number is prime", "Whether two states are entangled", "If a gate is unitary"], ans: 0 }
      ],
      11: [
        { q: "Shor's algorithm solves which problem?", opts: ["Graph coloring", "Integer factorization", "Matrix multiplication", "Shortest path finding"], ans: 1 },
        { q: "Shor's algorithm threatens the security of which encryption system?", opts: ["AES-256", "RSA", "SHA-256", "bcrypt"], ans: 1 },
        { q: "Shor's algorithm operates in what complexity class speedup?", opts: ["Quadratic speedup", "Exponential speedup", "Polynomial speedup", "No speedup"], ans: 1 },
        { q: "What mathematical routine inside Shor's algorithm runs on the quantum computer?", opts: ["GCD computation", "Period finding", "Prime generation", "Division"], ans: 1 },
        { q: "What quantum operation is key to finding the period in Shor's algorithm?", opts: ["Hadamard transform", "Quantum Fourier Transform QFT", "Amplitude amplification", "Phase estimation"], ans: 1 },
        { q: "On what mathematical group property is period finding based?", opts: ["Modular arithmetic exponentiation", "Linear equations", "Polynomial roots", "Permutations"], ans: 0 },
        { q: "What is the classical part of Shor's algorithm?", opts: ["Quantum Fourier Transform", "Calculating greatest common divisors GCD", "Period measurement", "Phase rotation"], ans: 1 },
        { q: "Shor's algorithm runs in which time complexity?", opts: ["Exponential time", "Polynomial time", "Logarithmic time", "Factorial time"], ans: 1 },
        { q: "RSA relies on the difficulty of:", opts: ["Solving discrete logs", "Factoring the product of two large prime numbers", "Finding shortest path", "Multiplying matrices"], ans: 1 },
        { q: "What quantum circuit component performs QFT?", opts: ["Only Hadamards", "Controlled phase rotation and Hadamard gates", "Only CNOTs", "Toffoli and SWAP gates"], ans: 1 }
      ],
      12: [
        { q: "Which of the following was the first protocol proposed for Quantum Key Distribution?", opts: ["BB84", "RSA", "Diffie-Hellman", "E91"], ans: 0 },
        { q: "What quantum principle prevents an eavesdropper from secretly copying quantum keys?", opts: ["Superposition principle", "No-cloning theorem", "Uncertainty principle", "Quantum decoherence"], ans: 1 },
        { q: "How many bases are used for encoding and decoding keys in BB84?", opts: ["1 basis", "2 bases: rectilinear and diagonal", "3 bases", "4 bases"], ans: 1 },
        { q: "What is the process of comparing subset keys to verify eavesdropping called?", opts: ["Sifting", "Key reconciliation", "Error correction", "Privacy amplification"], ans: 0 },
        { q: "If an eavesdropper measures a qubit in BB84, they introduce what error rate?", opts: ["0%", "25%", "50%", "100%"], ans: 1 },
        { q: "What is the eavesdropper commonly named in cryptography models?", opts: ["Alice", "Bob", "Eve", "Charlie"], ans: 2 },
        { q: "What is the outcome of Quantum Key Distribution?", opts: ["An encrypted text", "A shared private random cryptographic key", "A public signature", "A quantum coin"], ans: 1 },
        { q: "If Alice and Bob use the same basis, their measurement results are:", opts: ["Completely random", "100% correlated", "Opposite", "Decohered"], ans: 1 },
        { q: "If Alice and Bob use different bases, their results are:", opts: ["Identical", "Uncorrelated/random", "Opposite", "Predictable"], ans: 1 },
        { q: "What is the Heisenberg Uncertainty Principle's role in BB84?", opts: ["Enables superposition", "Measuring one property disturbs another", "Limits photon speed", "Validates no-cloning"], ans: 1 }
      ],
      13: [
        { q: "What is the primary cause of errors and loss of quantum information in physical qubits?", opts: ["Decoherence and environmental noise", "Lacking power supply", "High temperature", "Slow compilers"], ans: 0 },
        { q: "Which open-source SDK allows researchers to run programs on real prototype quantum processors?", opts: ["Qiskit", "Scikit-Learn", "NodeJS", "CUDA"], ans: 0 },
        { q: "What temperature is required for superconducting quantum computers?", opts: ["Room temperature", "Near absolute zero / millikelvin range", "Zero degrees Celsius", "100 Kelvin"], ans: 1 },
        { q: "What is the fundamental unit of quantum error correction?", opts: ["Physical qubit", "Logical qubit composed of multiple physical qubits", "Ancilla qubit", "Bit-flip code"], ans: 1 },
        { q: "What error correction code protects against both bit-flip and phase-flip errors?", opts: ["Shor 9-qubit code", "3-qubit bit-flip code", "3-qubit phase-flip code", "Hamming code"], ans: 0 },
        { q: "What is the most promising topology for 2D quantum error correction layout?", opts: ["Line code", "Surface code", "Star code", "Mesh code"], ans: 1 },
        { q: "What threshold defines when error correction reduces rather than increases error?", opts: ["Decoherence limit", "Fault-tolerance threshold", "Born limit", "Quantum supremacy limit"], ans: 1 },
        { q: "What are physical qubits that lose their state quickly called?", opts: ["Superposed qubits", "Noisy qubits / NISQ era qubits", "Ancilla qubits", "Clean qubits"], ans: 1 },
        { q: "What is decoherence?", opts: ["Measuring a qubit", "The loss of quantum behavior due to interaction with the environment", "Creating a superposition", "Entangling two qubits"], ans: 1 },
        { q: "Which physical qubit platform uses laser-cooled ions?", opts: ["Superconducting loop", "Trapped-ion quantum computer", "Quantum dot", "Topological computer"], ans: 1 }
      ]
    };
    return quantumQuizzes[sNum] || quantumQuizzes[1];
  }

  if (titleLower.includes("cybersecurity")) {
    const cyberQuizzes = {
      1: [
        { q: "What does the CIA triad stand for in information security?", opts: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Identification, Access", "Cryptography, Integrity, Authenticity"], ans: 1 },
        { q: "Which element of the CIA triad ensures that data is not altered by unauthorized users?", opts: ["Confidentiality", "Integrity", "Availability", "Authentication"], ans: 1 },
        { q: "What is confidentiality?", opts: ["Ensuring only authorized individuals can access information", "Keeping algorithms secret", "Hiding IP addresses", "Destroying old logs"], ans: 0 },
        { q: "What does availability mean?", opts: ["System is always connected to the internet", "Ensuring authorized users have access to systems when needed", "Allowing anyone to login", "Encrypting database contents"], ans: 1 },
        { q: "Which of these is a threat to Availability?", opts: ["Phishing", "SQL Injection", "DDoS attack", "Eavesdropping"], ans: 2 },
        { q: "What is a vulnerability?", opts: ["A weakness in a system that can be exploited", "A tool for hacking", "A type of firewall", "A secure protocol"], ans: 0 },
        { q: "What is an exploit?", opts: ["A bug in software", "Code or techniques that take advantage of a vulnerability", "A system patch", "An automated backup script"], ans: 1 },
        { q: "Which standard defines the security model of confidentiality?", opts: ["Bell-LaPadula model", "Biba model", "Brewer-Nash model", "Clark-Wilson model"], ans: 0 },
        { q: "What is a risk?", opts: ["A system crash", "The likelihood that a threat will exploit a vulnerability and cause loss", "An encrypted database", "An active session"], ans: 1 },
        { q: "What is the main objective of cybersecurity?", opts: ["Reformatting hard drives", "Writing compilers", "Protecting networks, devices, and data from unauthorized access", "Designing faster processors"], ans: 2 }
      ],
      2: [
        { q: "The security principle of 'Least Privilege' dictates that:", opts: ["Users have no permissions", "Users get minimal access necessary to do their job", "Only administrators have access", "All files are public"], ans: 1 },
        { q: "Multi-Factor Authentication (MFA) protects accounts by requiring:", opts: ["Multiple passwords", "At least two distinct verification factors", "Longer username lengths", "Biometric scans only"], ans: 1 },
        { q: "What is the principle of Defense in Depth?", opts: ["Hiding secrets deeply", "Using multiple layers of security controls", "Using very long passwords", "Using a single massive firewall"], ans: 1 },
        { q: "What does 'Separation of Duties' prevent?", opts: ["High network traffic", "Fraud and conflicts of interest by dividing tasks among multiple users", "SQL Injection attacks", "User interface errors"], ans: 1 },
        { q: "What is authentication?", opts: ["Determining permissions", "Verifying the identity of a user or system", "Encrypting backup files", "Scanning networks"], ans: 1 },
        { q: "What is authorization?", opts: ["Verifying passwords", "Determining what permissions an authenticated user has", "Sending emails securely", "Auditing access logs"], ans: 1 },
        { q: "Which of these is NOT one of the three core authentication factors?", opts: ["Something you know", "Something you have", "Something you search", "Something you are"], ans: 2 },
        { q: "What is non-repudiation?", opts: ["Restricting logins", "Ensuring that a sender cannot deny sending a message", "Using strong hashing", "Preventing hardware failure"], ans: 1 },
        { q: "What is 'Security through Obscurity'?", opts: ["Using active encryption key", "Relying on secrecy of design rather than active controls", "Implementing firewalls", "Applying system updates"], ans: 1 },
        { q: "What does 'Keep It Simple' mean in security architecture?", opts: ["Use simple passwords", "Simpler systems are easier to secure and audit", "Disable authorization entirely", "Avoid encryption"], ans: 1 }
      ],
      3: [
        { q: "What type of malicious software encrypts a victim's files and demands payment to decrypt them?", opts: ["Spyware", "Trojan Horse", "Ransomware", "Adware"], ans: 2 },
        { q: "Social engineering primarily targets which vulnerability in a security system?", opts: ["Firewall bugs", "Human manipulation", "Outdated software", "Weak encryption keys"], ans: 1 },
        { q: "What is phishing?", opts: ["Scanning open network ports", "Fraudulent emails designed to steal credentials or install malware", "Exploiting database tables", "Bypassing a router"], ans: 1 },
        { q: "What is a Zero-Day vulnerability?", opts: ["A bug fixed within 24 hours", "A vulnerability unknown to the vendor and has no patch", "A security log entry", "A malware file"], ans: 1 },
        { q: "What type of attack floods a server with traffic to make it crash?", opts: ["Phishing", "DDoS", "Ransomware", "Trojan"], ans: 1 },
        { q: "What is a Trojan Horse?", opts: ["A hardware bug", "Malware disguised as legitimate software", "An encrypted email", "A strong security scanner"], ans: 1 },
        { q: "What is SQL Injection?", opts: ["An database recovery tool", "Injecting malicious SQL queries into input forms to access databases", "Writing bad SQL queries", "Encrypting a table"], ans: 1 },
        { q: "What is Cross-Site Scripting (XSS)?", opts: ["Sending emails to multiple users", "Injecting malicious scripts into trusted websites viewed by other users", "An internet speed booster", "A proxy configuration"], ans: 1 },
        { q: "What type of social engineering targets high-profile executives specifically?", opts: ["Vishing", "Spear phishing", "Whaling", "Tailgating"], ans: 2 },
        { q: "What is a man-in-the-middle (MITM) attack?", opts: ["A physical thief in the server room", "Intercepting communications between two parties", "A broken network switch", "Guessing a password"], ans: 1 }
      ],
      4: [
        { q: "What is the primary function of a network firewall?", opts: ["Speeding up internet connection", "Filtering incoming and outgoing network traffic", "Detecting physical fire in server rooms", "Storing backup files"], ans: 1 },
        { q: "What does a Virtual Private Network (VPN) do?", opts: ["Creates a secure, encrypted tunnel over a public network", "Increases local area network bandwidth", "Generates virtual IP addresses", "Protects computers from physical theft"], ans: 0 },
        { q: "What does IDS stand for in networking?", opts: ["Internet Data System", "Intrusion Detection System", "Identity Database Service", "Input Delivery Solution"], ans: 1 },
        { q: "How does an IPS differ from an IDS?", opts: ["An IPS only logs events", "An IPS actively blocks detected threats, while an IDS only alerts", "An IPS is a hardware device", "An IPS encrypts files"], ans: 1 },
        { q: "What is DMZ (Demilitarized Zone) in network security?", opts: ["A zone with no security rules", "A subnetwork that exposes external-facing services to the internet", "A router backup system", "A private server room"], ans: 1 },
        { q: "What is port scanning?", opts: ["Deleting network logs", "Probing ports on a server to identify open services", "Fixing physical ports", "Setting up firewall filters"], ans: 1 },
        { q: "Which protocol encrypts web traffic?", opts: ["HTTP", "HTTPS", "FTP", "Telnet"], ans: 1 },
        { q: "What is the role of a proxy server?", opts: ["Acting as an intermediary for requests from clients", "Increasing network speed", "Providing wireless signals", "Generating passwords"], ans: 0 },
        { q: "What does MAC filtering do?", opts: ["Cleans up computer memory", "Restricts network access based on hardware network interface card addresses", "Protects Apple computers only", "Blocks specific web links"], ans: 1 },
        { q: "Which wireless security standard is currently the most secure?", opts: ["WEP", "WPA", "WPA2", "WPA3"], ans: 3 }
      ],
      5: [
        { q: "Which protocol is commonly used to query and manage directory information databases securely?", opts: ["LDAP", "HTTP", "FTP", "SMTP"], ans: 0 },
        { q: "Which is an example of a biometric authentication factor?", opts: ["A strong password", "An SMS one-time passcode", "A fingerprint scan", "A physical keycard"], ans: 2 },
        { q: "What does Single Sign-On (SSO) do?", opts: ["Prevents users from logging out", "Allows a user to log in once and access multiple systems", "Allows only one admin account", "Disables MFA"], ans: 1 },
        { q: "What is Role-Based Access Control (RBAC)?", opts: ["Creating accounts manually", "Assigning permissions based on job roles rather than individuals", "Letting users choose permissions", "Allowing all access"], ans: 1 },
        { q: "What does the OAuth standard handle?", opts: ["Email encryption", "Delegated authorization for web services", "Password resets", "File compression"], ans: 1 },
        { q: "What is SAML used for?", opts: ["Sending email attachments", "Exchanging authentication and authorization data between domains", "Logging server errors", "Encrypting disk drives"], ans: 1 },
        { q: "What is a federated identity?", opts: ["A database key", "Linking a user's identity across distinct identity management systems", "An admin password", "A multi-core processor identity"], ans: 1 },
        { q: "Which access control model uses security clearance levels and data classification?", opts: ["Role-Based Access Control RBAC", "Mandatory Access Control MAC", "Discretionary Access Control DAC", "Rule-Based Access Control"], ans: 1 },
        { q: "Which access control model allows resource owners to customize permissions?", opts: ["Mandatory Access Control MAC", "Discretionary Access Control DAC", "Role-Based Access Control RBAC", "Attribute-Based Access Control"], ans: 1 },
        { q: "What is a dictionary attack?", opts: ["Looking up spelling errors", "Attempting to guess passwords using a list of common words", "SQL Injection", "Flooding router packets"], ans: 1 }
      ],
      6: [
        { q: "What is the first step in a standard Incident Response plan?", opts: ["Containment", "Eradication", "Preparation", "Lessons Learned"], ans: 2 },
        { q: "Why is the containment phase critical in incident response?", opts: ["It acts as a training exercise", "It stops the threat from spreading further", "It deletes all servers", "It reports the event to news agencies"], ans: 1 },
        { q: "What are the six phases of Incident Response (SANS model)?", opts: ["Only Containment and Eradication", "Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned", "Planning, Building, Testing, Running, Fixing, Closing", "Identification, Alerting, Deleting, Restoring, Finishing, Documenting"], ans: 1 },
        { q: "What is 'Eradication' in incident response?", opts: ["Informing the media", "Removing the malware or threat from all infected systems", "Restoring database backups", "Replacing physical computers"], ans: 1 },
        { q: "What is the goal of the 'Lessons Learned' phase?", opts: ["Assigning blame to team members", "Improving future incident handling based on current experience", "Deleting security logs", "Closing the company down"], ans: 1 },
        { q: "What does forensic analysis do?", opts: ["Writing new antivirus code", "Collecting and analyzing digital evidence after a breach", "Scanning port traffic", "Designing firewalls"], ans: 1 },
        { q: "What is a SIEM?", opts: ["A router configuration tool", "Security Information and Event Management system for log analysis", "A physical backup server", "A dynamic database compiler"], ans: 1 },
        { q: "What is the purpose of chain of custody?", opts: ["Restricting network access", "Documenting the chronological history of evidence to preserve integrity", "Scheduling shift rotations", "Testing security patches"], ans: 1 },
        { q: "What is a CSIRT?", opts: ["A security database", "Computer Security Incident Response Team", "A type of firewall router", "A programming framework"], ans: 1 },
        { q: "What is the first action when detecting an active ransomware attack on a server?", opts: ["Updating the operating system", "Disconnecting it from the network to contain it", "Deleting all files", "Paying the ransom immediately"], ans: 1 }
      ]
    };
    return cyberQuizzes[sNum] || cyberQuizzes[1];
  }

  // Fallback / default quiz dataset (10 generic questions)
  return [
    { q: "What is the primary focus of this session?", opts: ["Core concepts and theories", "Hardware setup", "Programming workflows", "Platform configuration"], ans: 0 },
    { q: "How should you verify the practical outcomes of this lesson?", opts: ["By running local tests", "By ignoring errors", "By asking classmates", "By writing reports"], ans: 0 },
    { q: "Which of the following describes the key subject discussed?", opts: ["Theoretical foundations", "Debugging guidelines", "Historical milestones", "Software installation"], ans: 0 },
    { q: "Which tool is recommended to execute the workflows in this lesson?", opts: ["The standard IDE / terminal platform", "An email client", "A drawing package", "A spreadsheet compiler"], ans: 0 },
    { q: "What is the recommended study frequency for this module?", opts: ["Regular review and practice", "Only before exams", "Once a year", "Never"], ans: 0 },
    { q: "What represents a successful outcome for this session?", opts: ["Passing the quiz and grasping the concepts", "Creating 100 pages of notes", "Deleting the code", "Shutting down the workspace"], ans: 0 },
    { q: "Which resource provides extra guidance for this curriculum?", opts: ["Official documentation and readings", "Social media chats", "Random search engines", "Unverified blogs"], ans: 0 },
    { q: "Why is hands-on practice crucial in this subject?", opts: ["It solidifies understanding and skill", "It saves electrical power", "It fills database space", "It prevents screens from sleeping"], ans: 0 },
    { q: "What represents a primary challenge in mastering this material?", opts: ["Consistency and focus", "Hardware costs", "Finding standard browsers", "Using simple keyboards"], ans: 0 },
    { q: "Who is the primary audience for this course material?", opts: ["Students and technical professionals", "Retail merchants", "Creative artists", "General public"], ans: 0 }
  ];
};
