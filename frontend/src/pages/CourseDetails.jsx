import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiAward, FiBell, FiBookOpen, FiBookmark, FiCheck, FiCheckCircle,
  FiChevronLeft, FiClock, FiCpu, FiDownload, FiEdit3, FiExternalLink,
  FiLayers, FiMessageCircle, FiPlay, FiPlus, FiSend, FiStar, FiUser, FiZap,
  FiAlertCircle
} from "react-icons/fi";

import API from "../services/api";
import VideoPlayer from "../components/VideoPlayer";
import { getSessionTitle, getSessionQuizQuestions } from "../utils/quizzesData";
import { getDetailedCourseNotes } from "../utils/courseNotesData";

const courseMaterialUrl =
  "https://drive.google.com/drive/folders/1wWqAMtKA6nL5ohKEBR6lqQBmElQyyo2Q";
const cybersecurityCourseImage = "/images/cybersecurity-course.png";
const quantumCourseImage = "/images/quantum-computing-course.png";
const iotCourseImage = "/images/iot-workshop-course.png";
const quantumMaterialUrl =
  "https://drive.google.com/drive/folders/12Akq4zxcQlsYXvzSO0W37uZl6XykO_Bj";
const iotMaterialUrl =
  "https://drive.google.com/drive/folders/1mYBY6YtGV9VGGXi8ZTv0HqGw1N8F8Mpo";
const aiMaterialUrl =
  "https://drive.google.com/drive/folders/1RB4hKDQIwfw0y3T-CBfBP9Gmjjfep7vV";

const quantumCourse = {
  id: "quantum-computing-certification-course",
  title: "Quantum Computing Certification Course",
  description:
    "Build a practical foundation in qubits, quantum gates, superposition, entanglement, quantum circuits, and algorithms through structured week-wise recorded sessions.",
  category: "Quantum Computing",
  instructor_name: "ETLP Faculty",
  rating: "4.9",
  students: "850",
  duration: "4 Weeks",
  video_url: quantumMaterialUrl,
  thumbnail: quantumCourseImage,
  badges: ["Quantum Computing", "Certification"]
};

const iotCourse = {
  id: "iot-workshop",
  title: "IOT Workshop",
  description:
    "Learn how sensors, microcontrollers, wireless networks, cloud platforms, and connected devices work together through practical instructor-led IoT workshop sessions.",
  category: "IoT",
  instructor_name: "ETLP Faculty",
  rating: "4.8",
  students: "720",
  duration: "16 Sessions",
  video_url: iotMaterialUrl,
  thumbnail: iotCourseImage,
  badges: ["IoT Workshop", "Hands-on"]
};

const aiCourse = {
  id: "ai-tools-course",
  title: "AI Tools Course",
  description:
    "Learn popular AI tools, workflows, and applications through recorded sessions.",
  category: "AI",
  instructor_name: "ETLP Faculty",
  rating: "4.7",
  students: "900",
  duration: "13 Sessions",
  video_url: aiMaterialUrl,
  thumbnail: "/images/ai-tools-course-custom.svg",
  image: "/images/ai-tools-course-custom.svg",
  badges: ["AI", "Tools"]
};

const IOT_INCOMPLETE_FILE_IDS = new Set([
  "11EntbDBa6A2xGCKNI3yfOu_ODvTlgaBr",
  "1iqKhaAEn6uXTSQJMWoL1uRmjYMn7tyTt",
  "1mDrggbfV5NY-e-riroTViX0_ZPJndM_g",
  "1lZws2gAmBNHogUkuYTUSjZj_syOtFMJt"
]);

// Local fallback mapping for folderId -> array of file IDs (used when Drive API
// is unreachable or files are not publicly listable). Replace or extend as needed.
const DRIVE_FALLBACK = {
  "1wWqAMtKA6nL5ohKEBR6lqQBmElQyyo2Q": [
    { id: "1ROePYzWckoz26i8zl3Hv-GOYAZeqgSpm", name: "01_Cybersecurity_Introduction" },
    { id: "1_LyCc8vsyCAoOJ1oOoZ-6IRQrrBedhJS", name: "02_Core_Security_Principles" },
    { id: "1K421ZqOc4tP7e0UmsEtF3YPsbvlNoJbR", name: "03_Threats_and_Vulnerabilities" }
  ],
  "12Akq4zxcQlsYXvzSO0W37uZl6XykO_Bj": [
    { id: "quantum-vid-1", name: "01_Introduction_to_Quantum_Computing_&_Qubits" },
    { id: "quantum-vid-2", name: "02_Bloch_Sphere_&_Single_Qubit_States" },
    { id: "quantum-vid-3", name: "03_Quantum_Measurement_&_Probability" },
    { id: "quantum-vid-4", name: "04_Single_Qubit_Gates_(Hadamard,_Pauli_X,_Y,_Z)" },
    { id: "quantum-vid-5", name: "05_Multi-Qubit_Systems_&_Entanglement" },
    { id: "quantum-vid-6", name: "06_Entanglement,_Bell_States_&_CNOT" },
    { id: "quantum-vid-7", name: "07_Quantum_Circuit_Simulation_Basics" },
    { id: "quantum-vid-8", name: "08_Qiskit_&_IBM_Quantum_Platform" },
    { id: "quantum-vid-9", name: "09_Quantum_Protocols_(Teleportation,_Coding)" },
    { id: "quantum-vid-10", name: "10_Deutsch-Jozsa_&_Grover's_Search_Algorithms" },
    { id: "quantum-vid-11", name: "11_Shor's_Factoring_Algorithm" },
    { id: "quantum-vid-12", name: "12_Quantum_Cryptography_&_BB84" },
    { id: "quantum-vid-13", name: "13_Quantum_Computing_Outlook,_Qiskit_&_Valedictory_Session" }
  ],
  "1mYBY6YtGV9VGGXi8ZTv0HqGw1N8F8Mpo": [
    { id: "iot-vid-1", name: "01_IoT_Inaugural_Session" },
    { id: "iot-vid-2", name: "02_IoT_Architectures" },
    { id: "iot-vid-3", name: "03_Sensors_and_Actuators" },
    { id: "iot-vid-4", name: "04_Microcontrollers_and_ESP32" },
    { id: "iot-vid-5", name: "05_Embedded_C_Programming" },
    { id: "iot-vid-6", name: "06_Wireless_Communication_Protocols" },
    { id: "iot-vid-7", name: "07_Wi-Fi_and_Bluetooth_Connectivity" },
    { id: "iot-vid-8", name: "08_MQTT_Protocol_and_Message_Brokers" },
    { id: "iot-vid-9", name: "09_Cloud_Platforms_for_IoT" },
    { id: "iot-vid-10", name: "10_ThingsSpeak_and_Adafruit_IO" },
    { id: "iot-vid-11", name: "11_Node-RED_Dashboard_Setup" },
    { id: "iot-vid-12", name: "12_IoT_Security_and_Encryption" },
    { id: "iot-vid-13", name: "13_Edge_Computing_Basics" },
    { id: "iot-vid-14", name: "14_Industrial_IoT_Applications" },
    { id: "iot-vid-15", name: "15_IoT_Project_Showcase" },
    { id: "iot-vid-16", name: "16_Valedictory_and_Wrap-up" }
  ],
  "1RB4hKDQIwfw0y3T-CBfBP9Gmjjfep7vV": [
    { id: "ai-vid-1", name: "01_AI_Tools_and_Prompt_Engineering" },
    { id: "ai-vid-2", name: "02_Large_Language_Models_in_Action" },
    { id: "ai-vid-3", name: "03_AI_for_Content_Creation" },
    { id: "ai-vid-4", name: "04_AI-powered_Search_and_Research" },
    { id: "ai-vid-5", name: "05_Generative_AI_for_Images" },
    { id: "ai-vid-6", name: "06_AI_in_Software_Development" },
    { id: "ai-vid-7", name: "07_Automating_Tasks_with_AI" },
    { id: "ai-vid-8", name: "08_AI_for_Data_Analysis" },
    { id: "ai-vid-9", name: "09_Responsible_AI_and_Ethics" },
    { id: "ai-vid-10", name: "10_Future_of_AI_in_Workplaces" },
    { id: "ai-vid-11", name: "11_Custom_GPTs_and_Agent_Systems" },
    { id: "ai-vid-12", name: "12_AI_Workflow_Optimization" },
    { id: "ai-vid-13", name: "13_Final_Project_and_Course_Wrap-up" }
  ]
};

const getCourseOverviewDetails = (course) => {
  const courseIdentity = `${course?.title || ""} ${course?.category || ""}`.toLowerCase();
  
  if (courseIdentity.includes("quantum")) {
    return {
      learningOutcomes: [
        "Master Dirac notation, quantum states, superposition, and measurement principles.",
        "Construct multi-qubit circuits using Hadamard, Pauli X/Y/Z, CNOT, and Phase gates.",
        "Implement quantum teleportation, Deutsch-Jozsa, and Grover's search algorithm.",
        "Utilize Qiskit & IBM Quantum Experience for cloud-based quantum circuit execution."
      ],
      prerequisites: "Basic linear algebra, complex numbers, and introductory Python programming.",
      targetAudience: "B.Tech Computer Science / ECE students, AI research scholars, and quantum computing enthusiasts.",
      syllabusHighlights: [
        { week: "Week 1", title: "Single Qubit Mechanics & Bloch Spheres" },
        { week: "Week 2", title: "Entanglement, Bell States & CNOT Operations" },
        { week: "Week 3", title: "Quantum Algorithms (Grover & Shor Basics)" },
        { week: "Week 4", title: "Quantum Cryptography (BB84) & Qiskit Simulations" }
      ],
      headingNotes: [
        {
          title: "📌 1. Fundamentals of Quantum Bits (Qubits)",
          content: "Unlike classical bits (0 or 1), a qubit exists in a superposition state |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1. Measurement collapses the wavefunction into state |0⟩ or |1⟩ with probability |α|² or |β|²."
        },
        {
          title: "📌 2. Quantum Entanglement & Teleportation",
          content: "Entangled states (such as Bell State (|00⟩ + |11⟩)/√2) exhibit non-local correlations. Quantum teleportation transfers an arbitrary unknown qubit state using a shared entangled pair and classical communications."
        },
        {
          title: "📌 3. Quantum Circuit Optimization & Qiskit",
          content: "Quantum compilers map abstract gate representations onto physical transpiler topologies, minimizing gate depth and decoherence noise windows."
        }
      ]
    };
  }
  
  if (courseIdentity.includes("iot") || courseIdentity.includes("internet of things")) {
    return {
      learningOutcomes: [
        "Understand sensor interfacing, ESP32/Arduino microcontrollers, and GPIO control.",
        "Master MQTT, CoAP, and HTTP network protocols for lightweight sensor payload telemetry.",
        "Integrate cloud IoT dashboards (ThingsBoard, AWS IoT Core) for real-time telemetry analytics.",
        "Implement edge compute logic and security policies for firmware endpoints."
      ],
      prerequisites: "Basic C/C++ or Python, digital logic basics, and elementary electronic circuits.",
      targetAudience: "Engineering students, embedded systems developers, and hardware automation engineers.",
      syllabusHighlights: [
        { week: "Session 1 - 4", title: "Sensory Interfaces & Embedded Controller Setup" },
        { week: "Session 5 - 8", title: "Wireless Communication Protocols (MQTT, Wi-Fi, BLE)" },
        { week: "Session 9 - 12", title: "Cloud Integration & Analytics Dashboards" },
        { week: "Session 13 - 16", title: "Industrial IoT Security & Capstone Deployment" }
      ],
      headingNotes: [
        {
          title: "📌 1. IoT System Architecture Layers",
          content: "1. Sensing & Actuation Layer -> 2. Communication Gateway -> 3. Middleware & Cloud Services -> 4. User Application & Analytics Dashboard."
        },
        {
          title: "📌 2. MQTT Telemetry Protocol Principles",
          content: "Publish/Subscribe model operating over TCP/IP using minimal header overhead (2 bytes). Supports QoS 0 (At most once), QoS 1 (At least once), and QoS 2 (Exactly once)."
        },
        {
          title: "📌 3. Edge Computing & Firmware Hardening",
          content: "Store credentials in secure enclaves (e.g. ATECC608A), enforce TLS 1.3 mutual authentication, and implement encrypted OTA (Over-The-Air) firmware updates."
        }
      ]
    };
  }

  if (courseIdentity.includes("ai") || courseIdentity.includes("machine")) {
    return {
      learningOutcomes: [
        "Master prompt engineering, generative AI workflows, and modern LLM frameworks.",
        "Utilize popular AI tools for automated code generation, dataset synthesis, and computer vision.",
        "Implement Retrieval-Augmented Generation (RAG) using vector databases (Chroma, Pinecone).",
        "Deploy fine-tuned open-source models for enterprise automation pipelines."
      ],
      prerequisites: "General computer literacy and basic familiarity with data analysis or programming.",
      targetAudience: "Developers, students, data analysts, and tech professionals looking to supercharge productivity.",
      syllabusHighlights: [
        { week: "Module 1", title: "Generative AI Landscape & Prompt Engineering Foundations" },
        { week: "Module 2", title: "Vector Databases, Embeddings & RAG Architectures" },
        { week: "Module 3", title: "Autonomous AI Agents & Multi-Modal Assistants" },
        { week: "Module 4", title: "AI Model Fine-tuning, MLOps & Production Ethics" }
      ],
      headingNotes: [
        {
          title: "📌 1. Transformer Architecture & Attention Mechanisms",
          content: "Self-attention computes dynamic contextual representations: Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V, allowing parallel sequence processing."
        },
        {
          title: "📌 2. Retrieval-Augmented Generation (RAG)",
          content: "Combines dense vector retrieval from knowledge bases with generative LLMs to eliminate hallucinations and ground responses in real-time enterprise data."
        },
        {
          title: "📌 3. Prompt Engineering & Chain-of-Thought",
          content: "Structured prompting techniques (System Persona, Few-Shot Examples, Step-by-Step reasoning) drastically increase task execution accuracy."
        }
      ]
    };
  }

  // Default Cybersecurity overview
  return {
    learningOutcomes: [
      "Analyze threat vectors, vulnerability scoring (CVSS), and OWASP Top 10 web vulnerabilities.",
      "Design zero-trust network architectures, firewalls, IDS/IPS, and VPN tunneling.",
      "Execute ethical penetration testing, packet analysis with Wireshark, and log forensics.",
      "Understand cryptographic algorithms (AES-256, RSA, ECC) and PKI digital certificates."
    ],
    prerequisites: "Basic networking concepts (TCP/IP, HTTP/S) and familiarity with Linux CLI commands.",
    targetAudience: "Cybersecurity aspirants, IT administrators, software engineers, and CSE students.",
    syllabusHighlights: [
      { week: "Module 1", title: "Core Security Principles & Threat Modeling" },
      { week: "Module 2", title: "Network Defense, Firewalls & Intrusion Detection" },
      { week: "Module 3", title: "Web Application Security & OWASP Top 10" },
      { week: "Module 4", title: "Cryptography, PKI & Incident Response Management" }
    ],
    headingNotes: [
      {
        title: "📌 1. CIA Triad & Defense-in-Depth",
        content: "Core security posture relies on Confidentiality, Integrity, and Availability. Layered defense ensures that if one control fails, secondary controls prevent total compromise."
      },
      {
        title: "📌 2. Zero Trust Network Architecture (ZTNA)",
        content: "'Never trust, always verify'. Every request must be authenticated, authorized, and encrypted regardless of network origin."
      },
      {
        title: "📌 3. Vulnerability Mitigation & Incident Response",
        content: "Preparation -> Identification -> Containment -> Eradication -> Recovery -> Lessons Learned. Implement automated log monitoring (SIEM) and continuous patch pipelines."
      }
    ]
  };
};

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  

  const fetchCourse = async () => {
    if (id === quantumCourse.id) {
      setCourse(quantumCourse);
      return;
    }
    if (id === iotCourse.id) {
      setCourse(iotCourse);

      // Populate IoT workshop modules (session list) with compact Week · Session labels
      const rawCount = 13;
      const iotModules = Array.from({ length: rawCount }).map((_, idx) => {
        const sessionNum = idx + 1;
        // assign week number every 3 sessions (approx)
        const weekNum = Math.ceil(sessionNum / 3);
        return {
          id: `iot-${sessionNum}`,
          // displayName is preferred by getLessonName()
          displayName: `Week ${weekNum} · Session ${sessionNum}`,
          name: `Week ${weekNum} · Session ${sessionNum}`
        };
      });

      setModules(iotModules);
      if (iotModules.length > 0) setSelectedVideo(iotModules[0]);

      return;
    }
    if (id === aiCourse.id) {
      setCourse(aiCourse);
      // Let the Drive fetch populate modules when Modules tab is opened
      return;
    }

    try {
      const res = await API.get(`/courses/${id}`);
      const apiCourse = res.data.course || {};
      // If API returns AI course but no thumbnail, use our fallback SVG
      if ((apiCourse.id === 'ai-tools-course' || (`${apiCourse.title || ''} ${apiCourse.category || ''}`).toLowerCase().includes('ai')) && !apiCourse.thumbnail) {
        apiCourse.thumbnail = '/images/ai-tools-course-custom.svg';
      }
      // Ensure known courses have the correct Drive folder set for modules
      const text = (`${apiCourse.title || ''} ${apiCourse.category || ''}`).toLowerCase();
      if (!apiCourse.video_url) {
        if (text.includes('iot') || text.includes('internet of things')) {
          apiCourse.video_url = iotMaterialUrl;
        } else if (text.includes('quantum')) {
          apiCourse.video_url = quantumMaterialUrl;
        } else if (text.includes('ai')) {
          apiCourse.video_url = aiMaterialUrl;
        }
      }
      setCourse(apiCourse);
    } catch (error) {
      console.log(error);
      setCourse({
        id,
        title: "Cybersecurity Certification Course",
        description:
          "Master the building blocks of modern cybersecurity. In this comprehensive course, you will dive deep into network defense, threat analysis, secure systems, and practical protection workflows.",
        category: "Cybersecurity",
        instructor_name: "ETLP Faculty",
        rating: "4.8",
        students: "2.4k",
        video_url: courseMaterialUrl,
        thumbnail:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
        badges: ["Best Seller", "Beginner"]
      });
    }
  };

  const previewCourseIds = [
    "cybersecurity-certification-course",
    "quantum-computing-certification-course",
    "iot-workshop",
    "ai-tools-course"
  ];

  const isPreviewCourse = (courseId) => typeof courseId === "string" && previewCourseIds.includes(courseId);

  const enrollCourse = async () => {
    if (isPreviewCourse(course?.id)) {
      setIsEnrolled(true);
      localStorage.setItem(`etl_preview_enrollment_${course.id}`, "true");
      showToast("Enrollment saved for preview mode.", "success");
      return;
    }

    // redirect to login immediately if user not authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to enroll.", "error");
      navigate("/login", { state: { from: `/course/${course?.id}` } });
      return;
    }

    try {
      const res = await API.post("/enrollments/enroll", {
        courseId: course.id
      });

      if (res.data && res.data.success !== true) {
        showToast(res.data.message || 'Enrollment failed', 'error');
        return;
      }

      setIsEnrolled(true);
      showToast("Course Enrolled Successfully", "success");
    } catch (error) {
      console.log(error);
      const status = error?.response?.status;
      const errMsg = error?.response?.data?.message;

      if ((status === 400 || status === 404 || status === 401) && isPreviewCourse(course?.id)) {
        setIsEnrolled(true);
        localStorage.setItem(`etl_preview_enrollment_${course.id}`, "true");
        showToast("Enrollment saved for preview mode.", "success");
        return;
      }

      if (status === 401) {
        showToast("Please login to enroll.", "error");
        navigate("/login", { state: { from: `/course/${course?.id}` } });
        return;
      }
      showToast(errMsg || "Enrollment failed. Please try again.", "error");
    }
  };
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // check enrollment status when course loads
    const checkEnrollment = async () => {
      if (!course?.id) return;

      if (isPreviewCourse(course.id)) {
        const previewKey = `etl_preview_enrollment_${course.id}`;
        setIsEnrolled(localStorage.getItem(previewKey) === "true");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setIsEnrolled(false);
        return;
      }

      try {
        const res = await API.get(`/enrollments/status/${course.id}`);
        if (res.data && res.data.isEnrolled) setIsEnrolled(true);
      } catch (err) {
        // ignore — unauthenticated or not enrolled
      }
    };
    checkEnrollment();
  }, [course]);
  const courseIdentity = `${course?.title || ""} ${course?.category || ""}`.toLowerCase();
  const isQuantumCourse = courseIdentity.includes("quantum");
  const isIotCourse = courseIdentity.includes("iot") || courseIdentity.includes("internet of things");
  const lessons = isQuantumCourse ? [
    {
      icon: <FiCpu />,
      title: "Qubits and Quantum Gates",
      text: "Understand superposition, measurement, Bloch spheres, and the gates used to build quantum circuits."
    },
    {
      icon: <FiLayers />,
      title: "Week-wise Recorded Sessions",
      text: "Progress through four structured weeks of instructor-led sessions, examples, and quantum computing discussions."
    }
  ] : isIotCourse ? [
    {
      icon: <FiCpu />,
      title: "Connected Devices and Sensors",
      text: "Understand sensing, embedded controllers, communication protocols, and real-world connected-device workflows."
    },
    {
      icon: <FiLayers />,
      title: "Practical Workshop Sessions",
      text: "Follow the complete workshop from inauguration through hands-on IoT implementation sessions."
    }
  ] : [
    {
      icon: <FiCpu />,
      title: "Security Architectures",
      text: "Learn firewalls, IDS, VPNs, zero trust, and layered security models."
    },
    {
      icon: <FiLayers />,
      title: "Hands-on Labs",
      text: "Build and test your own defenses using guided practical exercises."
    }
  ];
  const materialUrl = course?.video_url || courseMaterialUrl;
  const courseImage =
    course?.thumbnail ||
    (`${course?.title || ""} ${course?.category || ""}`.toLowerCase().includes("cyber")
      ? cybersecurityCourseImage
      : `${course?.title || ""} ${course?.category || ""}`.toLowerCase().includes("quantum")
        ? quantumCourseImage
        : isIotCourse
          ? iotCourseImage
          : null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modules, setModules] = useState([]);
  const [openWeeks, setOpenWeeks] = useState({});
  const playerRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [studyPanel, setStudyPanel] = useState("notes");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m your AI learning assistant. Ask me to explain this lesson, create a summary, or quiz you on the key ideas."
    }
  ]);

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const [completedVideos, setCompletedVideos] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    if (course && user) {
      const storageKey = `etl_progress_${user.id}_${course.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedVideos(parsed.completedVideos || {});
          setCompletedQuizzes(parsed.completedQuizzes || {});
        } catch (e) {
          console.error("Error parsing progress", e);
        }
      } else {
        setCompletedVideos({});
        setCompletedQuizzes({});
      }
    }
  }, [course, user]);

  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  }, [selectedVideo?.id]);

  const saveProgress = (videos, quizzes) => {
    if (course && user) {
      const storageKey = `etl_progress_${user.id}_${course.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        completedVideos: videos,
        completedQuizzes: quizzes
      }));

      if (modules.length > 0) {
        let doneCount = 0;
        modules.forEach((mod) => {
          if (videos[mod.id] && quizzes[mod.id]) {
            doneCount++;
          }
        });
        const progressPercentage = Math.round((doneCount / modules.length) * 100);

        API.post("/enrollments/update-progress", {
          courseId: course.id,
          progress: progressPercentage
        }).catch((err) => console.warn("Failed to sync course progress", err));
      }
    }
  };

  const handleQuizSubmit = (event, questions) => {
    event.preventDefault();
    setQuizSubmitted(true);

    let allCorrect = true;
    for (let i = 0; i < questions.length; i++) {
      if (quizAnswers[i] !== questions[i].ans) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setQuizPassed(true);
      const newQuizzes = { ...completedQuizzes, [selectedVideo.id]: true };
      const newVideos = { ...completedVideos, [selectedVideo.id]: true };
      setCompletedQuizzes(newQuizzes);
      setCompletedVideos(newVideos);
      saveProgress(newVideos, newQuizzes);
      showToast("Quiz passed successfully! Lesson marked as completed.", "success");
    } else {
      setQuizPassed(false);
      showToast("Some answers are incorrect. Try again!", "error");
    }
  };

  const getSessionQuiz = (courseObj, videoObj) => {
    if (!courseObj || !videoObj) return [];
    const courseTitle = (courseObj.title || "").toLowerCase();
    const sessionNum = videoObj.session || 1;

    if (courseTitle.includes("quantum")) {
      const quantumQuizzes = {
        1: [
          { q: "Who originally proposed the concept of a quantum computer?", opts: ["Richard Feynman", "Albert Einstein", "Alan Turing", "Stephen Hawking"], ans: 0 },
          { q: "What is the basic unit of quantum information?", opts: ["Bit", "Qubit", "Byte", "Qubyte"], ans: 1 }
        ],
        2: [
          { q: "Which mathematical sphere represents the state space of a single qubit?", opts: ["Bloch Sphere", "Riemann Sphere", "Fermi Sphere", "Euler Sphere"], ans: 0 },
          { q: "Superposition allows a qubit to be in which state?", opts: ["Only |0⟩", "Only |1⟩", "Both |0⟩ and |1⟩ simultaneously", "Neither |0⟩ nor |1⟩"], ans: 2 }
        ],
        3: [
          { q: "Measuring a qubit in superposition collapses it to:", opts: ["A deterministic state (|0⟩ or |1⟩)", "Another superposition state", "A complex matrix", "Infinity"], ans: 0 },
          { q: "What mathematical construct represents quantum measurement operators?", opts: ["Hermitian Matrices", "Identity Matrices", "Singular Matrices", "Null Matrices"], ans: 0 }
        ],
        4: [
          { q: "Which single-qubit quantum gate creates equal superposition from state |0⟩?", opts: ["Pauli-X", "Hadamard (H)", "Pauli-Z", "CNOT"], ans: 1 },
          { q: "What is the action of the Pauli-X gate?", opts: ["Applies a phase shift", "Acts as a quantum NOT gate", "Measures the qubit", "Creates entanglement"], ans: 1 }
        ],
        5: [
          { q: "Which gate is commonly used to create quantum entanglement between two qubits?", opts: ["Hadamard Gate", "Pauli-Y Gate", "Controlled-NOT (CNOT) Gate", "Phase Gate"], ans: 2 },
          { q: "What state is created by applying a Hadamard followed by a CNOT gate?", opts: ["Bell State", "Product State", "Ground State", "Mixed State"], ans: 0 }
        ],
        6: [
          { q: "What is the characteristic property of Bell States?", opts: ["Zero superposition", "Maximal entanglement", "Infinite amplitude", "Classical independence"], ans: 1 },
          { q: "In a 2-qubit CNOT gate, which qubit is flipped if the control qubit is |1⟩?", opts: ["Control qubit", "Target qubit", "Both qubits", "Neither qubit"], ans: 1 }
        ],
        7: [
          { q: "What is the purpose of quantum circuit simulation?", opts: ["Testing algorithms on classical hardware", "Encrypting passwords", "Compiling JavaScript code", "Increasing CPU clock speed"], ans: 0 },
          { q: "Which gate operates as the controller in a quantum circuit?", opts: ["Target Gate", "Control Gate", "Measurement Gate", "Ancilla Gate"], ans: 1 }
        ],
        8: [
          { q: "What is the main software framework used to design quantum circuits for IBM computers?", opts: ["PyTorch", "Qiskit", "TensorFlow", "Pandas"], ans: 1 },
          { q: "In quantum circuit design, what does a wire represent?", opts: ["Flow of electric current", "Evolution of a qubit over time", "A classical resistor", "A physical cable"], ans: 1 }
        ],
        9: [
          { q: "What protocol transfers qubit information using entanglement and classical communication?", opts: ["Quantum Key Distribution", "Quantum Teleportation", "Grover's Search", "Superdense Coding"], ans: 1 },
          { q: "How many classical bits can be transmitted by sending one qubit in Superdense Coding?", opts: ["1 bit", "2 bits", "3 bits", "4 bits"], ans: 1 }
        ],
        10: [
          { q: "What kind of computational speedup does Grover's search algorithm provide?", opts: ["Linear speedup", "Quadratic speedup", "Exponential speedup", "Logarithmic speedup"], ans: 1 },
          { q: "The Deutsch-Jozsa algorithm determines whether a given function is constant or:", opts: ["Balanced", "Injective", "Periodic", "Reversible"], ans: 0 }
        ],
        11: [
          { q: "Shor's algorithm solves which mathematical problem?", opts: ["Graph coloring", "Integer factorization", "Matrix multiplication", "Shortest path finding"], ans: 1 },
          { q: "Shor's algorithm threatens the security of which widely used encryption system?", opts: ["AES-256", "RSA", "SHA-256", "bcrypt"], ans: 1 }
        ],
        12: [
          { q: "Which of the following was the first protocol proposed for Quantum Key Distribution?", opts: ["BB84", "RSA", "Diffie-Hellman", "E91"], ans: 0 },
          { q: "What quantum principle prevents an eavesdropper from secretly copying quantum keys?", opts: ["Superposition principle", "No-cloning theorem", "Uncertainty principle", "Quantum decoherence"], ans: 1 }
        ],
        13: [
          { q: "What is the primary cause of errors and loss of quantum information in physical qubits?", opts: ["Decoherence and environmental noise", "Lacking power supply", "High temperature", "Slow compilers"], ans: 0 },
          { q: "Which open-source SDK allows researchers to run programs on real prototype quantum processors?", opts: ["Qiskit", "Scikit-Learn", "NodeJS", "CUDA"], ans: 0 }
        ]
      };
      return quantumQuizzes[sessionNum] || quantumQuizzes[1];
    }

    if (courseTitle.includes("cybersecurity")) {
      const cyberQuizzes = {
        1: [
          { q: "What does the CIA triad stand for in information security?", opts: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Identification, Access", "Cryptography, Integrity, Authenticity"], ans: 1 },
          { q: "Which element of the CIA triad ensures that data is not altered by unauthorized users?", opts: ["Confidentiality", "Integrity", "Availability", "Authentication"], ans: 1 }
        ],
        2: [
          { q: "The security principle of 'Least Privilege' dictates that:", opts: ["Users have no permissions", "Users get minimal access necessary to do their job", "Only administrators have access", "All files are public"], ans: 1 },
          { q: "Multi-Factor Authentication (MFA) protects accounts by requiring:", opts: ["Multiple passwords", "At least two distinct verification factors", "Longer username lengths", "Biometric scans only"], ans: 1 }
        ],
        3: [
          { q: "What type of malicious software encrypts a victim's files and demands payment to decrypt them?", opts: ["Spyware", "Trojan Horse", "Ransomware", "Adware"], ans: 2 },
          { q: "Social engineering primarily targets which vulnerability in a security system?", opts: ["Firewall bugs", "Human manipulation", "Outdated software", "Weak encryption keys"], ans: 1 }
        ],
        4: [
          { q: "What is the primary function of a network firewall?", opts: ["Speeding up internet connection", "Filtering incoming and outgoing network traffic", "Detecting physical fire in server rooms", "Storing backup files"], ans: 1 },
          { q: "What does a Virtual Private Network (VPN) do?", opts: ["Creates a secure, encrypted tunnel over a public network", "Increases local area network bandwidth", "Generates virtual IP addresses", "Protects computers from physical theft"], ans: 0 }
        ],
        5: [
          { q: "Which protocol is commonly used to query and manage directory information databases securely?", opts: ["LDAP", "HTTP", "FTP", "SMTP"], ans: 0 },
          { q: "Which is an example of a biometric authentication factor?", opts: ["A strong password", "An SMS one-time passcode", "A fingerprint scan", "A physical keycard"], ans: 2 }
        ],
        6: [
          { q: "What is the first step in a standard Incident Response plan?", opts: ["Containment", "Eradication", "Preparation", "Lessons Learned"], ans: 2 },
          { q: "Why is the containment phase critical in incident response?", opts: ["It acts as a training exercise", "It stops the threat from spreading further", "It deletes all servers", "It reports the event to news agencies"], ans: 1 }
        ]
      };
      return cyberQuizzes[sessionNum] || cyberQuizzes[1];
    }

    return [
      { q: "What is the primary focus of this session?", opts: ["Core concepts and theories", "Hardware setup", "Programming workflows", "Platform configuration"], ans: 0 },
      { q: "How should you verify the practical outcomes of this lesson?", opts: ["By running local tests", "By ignoring errors", "By asking classmates", "By writing reports"], ans: 0 }
    ];
  };

  const lessonNames = [
    "Introduction to Cybersecurity",
    "Core Security Principles",
    "Threats and Vulnerabilities",
    "Network Defense Essentials",
    "Identity and Access Control",
    "Incident Response Basics"
  ];

  const getLessonName = (module, index) => {
    if (module?.displayName) return module.displayName;
    const name = module?.name || "";
    return name.startsWith("Module -") ? lessonNames[index] || `Lesson ${index + 1}` : name;
  };

  const getQuantumModuleMeta = (file) => {
    const name = file.name || "";
    const upper = name.toUpperCase();
    const weekMatch = upper.match(/WEEK\s*[-_ ]?\s*(\d+)/);
    const sessionMatch = upper.match(/SESSION\s*[-_ ]?\s*(\d+)/);
    const partMatch = name.match(/Recording\s+(\d+)/i);
    const isValedictory = /VALIDECTORY|VALEDICTORY/.test(upper);

    // Parse sequential prefix number (e.g. 05 from 05_Dec30_Part1)
    const prefixMatch = name.match(/^(\d+)/);
    const prefixNum = prefixMatch ? Number(prefixMatch[1]) : null;

    let week = 99;
    if (isValedictory) {
      week = 5;
    } else if (weekMatch) {
      week = Number(weekMatch[1]);
    } else if (prefixNum) {
      if (prefixNum >= 1 && prefixNum <= 3) week = 1;
      else if (prefixNum >= 4 && prefixNum <= 8) week = 2;
      else if (prefixNum >= 9 && prefixNum <= 10) week = 3;
      else if (prefixNum >= 11 && prefixNum <= 13) week = 4;
    } else {
      week = 1;
    }

    const session = prefixNum ? prefixNum : Number(sessionMatch?.[1] || 1);
    
    // Sort stamp mapping using prefix number or fallbacks
    let sortStamp = "99999999999999";
    if (prefixNum) {
      sortStamp = String(prefixNum).padStart(14, "0");
    }

    const weekLabel = isValedictory ? "Special Session" : `Week ${week}`;
    
    // Check if filename has part indicator like _Part1 or _Part2 or Recording
    const partLabel = partMatch ? ` · Part ${partMatch[1]}` : "";
    let filenamePartLabel = "";
    const filenamePartMatch = name.match(/Part\s*[-_ ]?\s*(\d+)/i);
    if (filenamePartMatch) {
      filenamePartLabel = ` · Part ${filenamePartMatch[1]}`;
    }

    const quantumTitles = {
      1: "Introduction to Quantum Computing & Qubits",
      2: "Qubits, Superposition & Bloch Sphere",
      3: "Quantum Measurements & Mathematical Basics",
      4: "Single-Qubit Quantum Gates (Hadamard, Pauli, Phase Gates)",
      5: "Multiple Qubits & Entanglement (CNOT, Bell States)",
      6: "Multiple Qubits & Entanglement (CNOT, Bell States)",
      7: "Quantum Circuit Design & Simulation",
      8: "Quantum Circuit Design & Simulation",
      9: "Quantum Information Protocols (Teleportation & Superdense Coding)",
      10: "Deutsch-Jozsa & Grover's Search Algorithm",
      11: "Introduction to Shor's Factoring Algorithm",
      12: "Quantum Cryptography & QKD (BB84 Protocol)",
      13: "Quantum Computing Outlook, Qiskit & Valedictory Session"
    };

    const topic = quantumTitles[session] || "Quantum Computing Session";
    const finalPartLabel = partLabel || filenamePartLabel;

    return {
      week,
      weekLabel,
      session,
      sortStamp,
      displayName: isValedictory
        ? `Valedictory Session: ${topic}`
        : `Session ${session}: ${topic}${finalPartLabel}`
    };
  };

  const moduleGroups = modules.reduce((groups, module) => {
    const label = module.weekLabel || "Course Modules";
    const existing = groups.find((group) => group.label === label);
    if (existing) existing.modules.push(module);
    else groups.push({ label, modules: [module] });
    return groups;
  }, []);

  function fmtTime(s) {
    if (!s && s !== 0) return "0:00";
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    const min = Math.floor(s / 60);
    return `${min}:${sec}`;
  }



  const handleQuizRetake = () => {
    const activeSessionNum = selectedVideo ? (modules.findIndex((item) => item.id === selectedVideo?.id) + 1) : 1;
    const videoId = selectedVideo?.id || `session_${activeSessionNum}`;
    const newQuizzes = { ...completedQuizzes, [videoId]: false };
    const newVideos = { ...completedVideos, [videoId]: false };
    
    setCompletedQuizzes(newQuizzes);
    setCompletedVideos(newVideos);
    setQuizPassed(false);
    setQuizAnswers({});
    setQuizSubmitted(false);

    saveProgress(newVideos, newQuizzes);
  };

  const handleNewNote = () => {
    const time = playerRef.current?.getCurrentTime?.() || 0;
    const text = window.prompt(`Add note at ${fmtTime(time)}:`);
    if (text && text.trim()) {
      setNotes((p) => [{ time, text: text.trim() }, ...p]);
    }
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message || chatLoading) return;
    setChatInput("");
    setChatMessages((current) => [...current, { role: "user", text: message }]);
    setChatLoading(true);

    try {
      const response = await API.post("/ai/chatbot", {
        message,
        context: {
          courseTitle: course?.title,
          moduleTitle: selectedVideo?.name || course?.title
        }
      });
      setChatMessages((current) => [
        ...current,
        { role: "assistant", text: response.data?.reply || "I could not generate a response." }
      ]);
    } catch {
      setChatMessages((current) => [
        ...current,
        { role: "assistant", text: "I’m having trouble reaching the AI service right now. Try asking again in a moment." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Toast for non-blocking feedback
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const showToast = (message, type = "info", ms = 3000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "info" }), ms);
  };

  useEffect(() => {
    // Fetch Drive folder files when Modules tab is active and course material points to a Drive folder
    const fetchDriveFiles = async () => {
      try {
        const match = materialUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
        const folderId = match ? match[1] : null;
        if (!folderId) return;
        let files = [];
        let saEnabled = false;

        // Only use the native streaming route when the service account can
        // actually read this folder. Having credentials configured alone does
        // not guarantee that the Drive files were shared with that account.
        try {
          const res = await API.get(`/drive/sa/files?folderId=${folderId}`);
          files = res.data.files || [];
          saEnabled = true;
        } catch (err) {
          console.warn("Drive service account cannot access this folder", err?.message);
        }

        if (!files.length) {
          try {
            const res = await API.get(`/drive/files?folderId=${folderId}`);
            files = res.data.files || [];
          } catch (err) {
            console.warn("Public Drive API list failed, falling back to local mapping", err?.message);
          }
        }

        // If Drive API didn't return usable files, check local fallback map
        if ((!files || files.length === 0) && DRIVE_FALLBACK[folderId]) {
          files = DRIVE_FALLBACK[folderId].map((item) => {
            const isObj = typeof item === "object";
            return {
              id: isObj ? item.id : item,
              name: isObj ? item.name : `Module - ${item}`,
              mimeType: "video/mp4",
              thumbnailLink: null
            };
          });
        }

        const IOT_FOLDER_ID = "1mYBY6YtGV9VGGXi8ZTv0HqGw1N8F8Mpo";
        const AI_FOLDER_ID = "1RB4hKDQIwfw0y3T-CBfBP9Gmjjfep7vV";
        const isQuantumCourse = folderId === "12Akq4zxcQlsYXvzSO0W37uZl6XykO_Bj";
        const isAiCourse = folderId === AI_FOLDER_ID;
        const videoFiles = files.filter((f) => (f.mimeType || "").startsWith("video/") && (!isQuantumCourse || !/transcript/i.test(f.name || "")));

        // For IoT folder, expose all sessions and map to compact Week · Session labels
        const selectedFiles = isQuantumCourse ? videoFiles : videoFiles; // include all by default

        let mapped = [];

        if (folderId === IOT_FOLDER_ID || isAiCourse) {
          // Build IoT modules using the drive files order and produce Week headings
          mapped = selectedFiles.map((f, idx) => {
            const sessionNum = idx + 1;
            const week = Math.ceil(sessionNum / 3);
            return {
              id: f.id || `iot-${sessionNum}`,
              // weekLabel becomes the heading (e.g. 'Week 1') used by moduleGroups
              weekLabel: `Week ${week}`,
              // session number for sorting/presentation
              session: sessionNum,
              // displayName is the sub-session label shown under the week heading
              displayName: `Session ${sessionNum}`,
              name: `Session ${sessionNum}`,
              mimeType: f.mimeType,
              embedUrl: f.id ? `https://drive.google.com/file/d/${f.id}/preview` : null,
              streamUrl: saEnabled ? `${API.defaults.baseURL}/drive/sa/file/${f.id}` : null,
              thumbnail: f.thumbnailLink || null
            };
          });
        } else {
          mapped = selectedFiles
            .map((f) => ({
              id: f.id,
              name: f.name || `Module ${f.id}`,
              mimeType: f.mimeType,
              embedUrl: `https://drive.google.com/file/d/${f.id}/preview`,
              streamUrl: saEnabled ? `${API.defaults.baseURL}/drive/sa/file/${f.id}` : null,
              thumbnail: f.thumbnailLink || null,
              ...(isQuantumCourse ? getQuantumModuleMeta(f) : {})
            }))
            .sort((a, b) => (a.week || 0) - (b.week || 0) || (a.sortStamp || "").localeCompare(b.sortStamp || "") || (a.session || 0) - (b.session || 0) || a.name.localeCompare(b.name));
        }

        // Ensure IoT shows all sessions (fallback to placeholders if Drive returns fewer)
        if (folderId === IOT_FOLDER_ID) {
          const EXPECTED_IOT_COUNT = 13;
          if (mapped.length < EXPECTED_IOT_COUNT) {
            const filled = Array.from({ length: EXPECTED_IOT_COUNT }).map((_, idx) => {
              if (mapped[idx]) return mapped[idx];
              const sessionNum = idx + 1;
              const week = Math.ceil(sessionNum / 3);
              return {
                id: `iot-placeholder-${sessionNum}`,
                weekLabel: `Week ${week}`,
                session: sessionNum,
                name: `Session ${sessionNum}`,
                displayName: `Session ${sessionNum}`,
                mimeType: null,
                embedUrl: null,
                streamUrl: null,
                thumbnail: null
              };
            });
            setModules(filled);
            if (filled.length > 0) setSelectedVideo(filled[0]);
          } else {
            setModules(mapped);
            if (mapped.length > 0) setSelectedVideo(mapped[0]);
          }
        } else {
          setModules(mapped);
          if (mapped.length > 0) setSelectedVideo(mapped[0]);
        }
      } catch (error) {
        console.error("Failed to fetch Drive files", error);
      }
    };

    if (activeTab === "Modules") {
      fetchDriveFiles();
    }
  }, [activeTab, materialUrl]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await API.post('/uploads/cloudinary', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      });

      if (res.data && res.data.success && res.data.url) {
        const newMod = {
          id: `uploaded-${Date.now()}`,
          name: res.data.originalName || file.name,
          embedUrl: res.data.url,
          streamUrl: null,
          thumbnail: null
        };

        setModules((p) => [newMod, ...p]);
        setSelectedVideo(newMod);
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (err) {
      console.error('Upload error', err);
      showToast('Upload error', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-shell">
          <p className="course-detail-loading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page" style={{ background: "#0a0f1d", color: "#ffffff", minHeight: "100vh" }}>
      {/* Toast container */}
      {toast.visible && (
        <div style={{ position: 'fixed', right: 20, bottom: 24, zIndex: 9999 }}>
          <div style={{
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#111827',
            color: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.2)',
            minWidth: 260
          }}>
            {toast.message}
          </div>
        </div>
      )}
      <section className={`course-detail-shell ${activeTab === "Modules" ? "modules-active" : ""}`}>

        <div className="course-detail-grid">
          <div className="course-detail-main">
            <div className="course-hero-card">
              <div className="course-hero-image">
                {courseImage ? <img src={courseImage} alt={`${course.title} course`} /> : null}
                <div className="course-hero-overlay">
                  <div className="course-hero-badges">
                    {(course.badges || [course.category || "Cybersecurity"]).map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </div>

                  <h1>{course.title}</h1>
                  <p>Build practical skills for secure systems, network defense, and threat analysis.</p>

                  <div className="course-hero-meta">
                    <span>
                      <FiUser /> {course.instructor_name || "ETLP Faculty"}
                    </span>
                    <span>
                      <FiStar /> {course.rating || "4.8"} ({course.students || "2.4k"} reviews)
                    </span>
                    <span>
                      <FiClock /> {course.duration || "12h"}
                    </span>
                    
                  </div>

                </div>
              </div>
            </div>

            <nav className="course-tabs">
              {["Overview", "Modules", "Reviews"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => {
                    if (tab === "Modules" && !isEnrolled) {
                      showToast("Please enroll in the course to access Modules.", "error");
                      setActiveTab("Overview");
                      return;
                    }
                    setActiveTab(tab);
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <main className="course-detail-content">
              {activeTab === "Overview" && (() => {
                const overviewData = getCourseOverviewDetails(course);
                return (
                  <div className="overview-container">
                    {/* 1. About Section */}
                    <div className="overview-enhanced-card">
                      <div className="overview-section-title">
                        <FiBookOpen style={{ color: '#06b6d4' }} /> About This Course
                      </div>
                      <p style={{ lineHeight: '1.7', color: 'rgba(248, 250, 252, 0.9)', fontSize: '15px' }}>
                        {course.description ||
                          "Master the building blocks of modern computer science and engineering technologies. In this comprehensive course, you will dive deep into theoretical foundations, practical applications, interactive sessions, and industry-standard workflows."}
                      </p>
                      <div className="note-callout-box">
                        <FiZap style={{ flexShrink: 0 }} />
                        <span><strong>JNTU-GV Approved Curriculum:</strong> Content is structured to match university syllabus frameworks and real-world domain competencies.</span>
                      </div>
                    </div>

                    {/* 2. Key Learning Outcomes */}
                    <div className="overview-enhanced-card">
                      <div className="overview-section-title">
                        <FiAward style={{ color: '#6366f1' }} /> Key Learning Outcomes
                      </div>
                      <div className="overview-outcomes-grid">
                        {overviewData.learningOutcomes.map((outcome, idx) => (
                          <div key={idx} className="outcome-card">
                            <div className="outcome-icon"><FiCheckCircle /></div>
                            <div style={{ fontSize: '13.5px', color: 'rgba(248, 250, 252, 0.9)', lineHeight: '1.5' }}>
                              {outcome}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Heading Notes & Key Cheat Sheet */}
                    <div className="overview-enhanced-card">
                      <div className="overview-section-title">
                        <FiEdit3 style={{ color: '#f59e0b' }} /> Course Heading Notes & Reference Cheat Sheet
                      </div>
                      <p className="text-secondary small mb-3">Professional study notes and core takeaways summarized for this course:</p>
                      <div className="heading-notes-container">
                        {overviewData.headingNotes.map((noteItem, idx) => (
                          <div key={idx} className="heading-note-card">
                            <div className="heading-note-header">
                              <span>{noteItem.title}</span>
                              <span className="badge bg-indigo-subtle text-indigo" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Key Reference</span>
                            </div>
                            <div className="heading-note-body">
                              {noteItem.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Target Audience & Prerequisites */}
                    <div className="overview-enhanced-card">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="overview-section-title" style={{ fontSize: '1.05rem' }}>
                            <FiUser style={{ color: '#ec4899' }} /> Target Audience
                          </div>
                          <p className="small text-secondary" style={{ lineHeight: '1.6' }}>
                            {overviewData.targetAudience}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <div className="overview-section-title" style={{ fontSize: '1.05rem' }}>
                            <FiLayers style={{ color: '#10b981' }} /> Prerequisites
                          </div>
                          <p className="small text-secondary" style={{ lineHeight: '1.6' }}>
                            {overviewData.prerequisites}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === "Modules" && (
                <>
                  {false && (
                  <>
                  <h2>Modules</h2>
                  <div className="modules-grid">
                    <aside className="modules-list">
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <button type="button" className="btn-premium-cyan" onClick={handleUploadClick}>Upload Video</button>
                        {uploading && <div style={{ color: 'var(--text-secondary)' }}>Uploading {uploadProgress}%</div>}
                        <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
                      </div>
                      <ul>
                        {modules.length > 0 ? (
                          modules.map((m) => (
                            <li key={m.id}>
                              <button type="button" onClick={() => setSelectedVideo(m)}>
                                {m.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          // Fallback: open folder link
                          <li>
                            <a href={materialUrl} target="_blank" rel="noreferrer">
                              Open Drive Folder <FiExternalLink />
                            </a>
                          </li>
                        )}
                      </ul>
                    </aside>

                    <section className="modules-player">
                      <div className="player-shell">
                        <div className="player-header">
                          <div className="player-title">{selectedVideo?.name || course.title}</div>
                          <div className="player-actions">
                            <button type="button" title="Bookmark">Bookmark</button>
                            <button type="button" title="Resources">Resources</button>
                          </div>
                        </div>

                        <div className="player-body">
                          <div className="player-main">
                            <VideoPlayer ref={playerRef} video={selectedVideo || { embedUrl: materialUrl }} />
                          </div>

                          <aside className="player-sidebar">
                            <div className="notes-tabs">
                              <div className="tabs">
                                <button className="active">Notes</button>
                                <button>AI Assistant</button>
                              </div>

                              <div className="notes-area">
                                <div className="note-meta">Take dynamic notes synced to the video timestamp.</div>
                                <div className="note-list">
                                  {notes.length === 0 ? (
                                    <div className="note-empty">No notes yet — add one.</div>
                                  ) : (
                                    notes.map((n, i) => (
                                      <div className="note-item" key={i}><strong>{fmtTime(n.time)}</strong> {n.text}</div>
                                    ))
                                  )}
                                </div>
                                <button type="button" className="new-note" onClick={handleNewNote}>New Note</button>
                              </div>
                            </div>

                             <div className="lesson-playlist">
                               <h5>Lesson Playlist</h5>
                               <ul>
                                 {modules.map((mod, idx) => {
                                   const active = selectedVideo?.id === mod.id;
                                   const complete = !!completedVideos[mod.id] && !!completedQuizzes[mod.id];
                                   return (
                                     <li key={mod.id} className={`${active ? 'active' : ''} ${complete ? 'complete' : ''}`}>
                                       <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                                         <button type="button" onClick={() => { setSelectedVideo(mod); setStudyPanel("quiz"); }} style={{ flexGrow: 1, background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>
                                           <div className="lesson-meta" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                             <span className="lesson-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                               {complete ? <FiCheckCircle style={{ color: '#22c55e' }} /> : <span>{idx + 1}.</span>}
                                               {mod.name}
                                             </span>
                                             <span className="lesson-time" style={{ fontSize: '11px', opacity: 0.6 }}>
                                               {mod.duration ? fmtTime(mod.duration) : '0:00'}
                                             </span>
                                           </div>
                                         </button>
                                         <button
                                           type="button"
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             const sessionIndex = modules.findIndex((item) => item.id === mod.id) + 1;
                                             navigate(`/session-quiz/${course.id}/${sessionIndex}`);
                                           }}
                                           style={{
                                             background: complete ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
                                             border: complete ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(99,102,241,0.3)',
                                             color: complete ? '#22c55e' : '#818cf8',
                                             borderRadius: '50%',
                                             width: '28px',
                                             height: '28px',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             cursor: 'pointer',
                                             flexShrink: 0,
                                             fontSize: '12px'
                                           }}
                                           title="Take Session Quiz"
                                         >
                                           <FiAward />
                                         </button>
                                       </div>
                                     </li>
                                   );
                                 })}
                               </ul>
                             </div>
                           </aside>
                         </div>
                       </div>
                     </section>
                   </div>
                   </>
                   )}
                   <section className="learning-workspace">
                     <div className="learning-video-column">
                       <div className="learning-video-card">
                         <VideoPlayer ref={playerRef} video={selectedVideo || { embedUrl: materialUrl }} />
                       </div>
 
                       <div className="learning-title-row">
                         <div>
                           <div className="learning-kicker">
                             <span>{course.category || "Course"}</span>
                             <span>{selectedVideo?.weekLabel || `Module ${Math.max(1, modules.findIndex((item) => item.id === selectedVideo?.id) + 1)}`}</span>
                           </div>
                           <h1>{getLessonName(selectedVideo, Math.max(0, modules.findIndex((item) => item.id === selectedVideo?.id))) || course.title}</h1>
                           <p>{course.description}</p>
                         </div>
                         <div className="learning-actions" style={{ display: 'flex', gap: '8px' }}>
                           <button type="button"><FiBookmark /> Bookmark</button>
                         </div>
                       </div>

                      <div className="lesson-playlist learning-playlist">
                        <div className="playlist-heading">
                          <div><span className="playlist-eyebrow">Course content</span><h2>Lesson playlist</h2></div>
                          <span>{modules.length || 3} lessons · 42 min</span>
                        </div>
                        <ul>
                          {moduleGroups.length > 0 ? (
                            moduleGroups.map((group) => {
                              const isOpen = openWeeks[group.label] !== undefined ? !!openWeeks[group.label] : true;
                              return (
                                <li key={group.label} className="week-group">
                                  <div className="week-module-heading">
                                    <button
                                      type="button"
                                      className={`week-toggle ${isOpen ? 'open' : ''}`}
                                      onClick={() => setOpenWeeks((prev) => ({ ...prev, [group.label]: !isOpen }))}
                                    >
                                      <strong>{group.label}</strong>
                                      <span>{group.modules.length} sessions</span>
                                    </button>
                                  </div>

                                  {isOpen && (
                                    <ul className="week-sessions">
                                      {group.modules.map((mod, idx) => {
                                        const active = selectedVideo?.id === mod.id;
                                        const complete = !!completedVideos[mod.id] && !!completedQuizzes[mod.id];
                                        return (
                                          <li key={mod.id} className={`${active ? 'active' : complete ? 'complete' : ''}`} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                                            <button type="button" onClick={() => {
                                              if (!isEnrolled) {
                                                showToast('Enroll in the course to access this module.', 'error');
                                                return;
                                              }
                                              setSelectedVideo(mod);
                                              setStudyPanel("quiz");
                                            }} style={{ flexGrow: 1, background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>
                                              <span className="lesson-status">{active ? <FiPlay /> : complete ? <FiCheck /> : <span>{modules.findIndex((item) => item.id === mod.id) + 1}</span>}</span>
                                              <span className="lesson-copy">
                                                <strong>{getLessonName(mod, modules.findIndex((item) => item.id === mod.id))}</strong>
                                                <small>
                                                  {active ? 'In progress' : complete ? 'Completed' : 'Video lesson'}
                                                  {mod.duration ? ` · ${fmtTime(mod.duration)}` : ` · ${8 + idx * 3}:20`}
                                                </small>
                                              </span>
                                              {complete && <FiCheckCircle className="lesson-check" />}
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVideo(mod);
                                                setStudyPanel("quiz");
                                              }}
                                              style={{
                                                background: complete ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
                                                border: complete ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(99,102,241,0.3)',
                                                color: complete ? '#22c55e' : '#818cf8',
                                                borderRadius: '50%',
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease',
                                                marginRight: '12px'
                                              }}
                                              title={complete ? "Quiz Completed" : "Take Session Quiz"}
                                            >
                                              <FiAward />
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            })
                          ) : (
                            <li className="playlist-empty"><a href={materialUrl} target="_blank" rel="noreferrer">Open course folder <FiExternalLink /></a></li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <aside className="study-panel">
                      <div className="study-tabs">
                        <button type="button" className={studyPanel === "notes" ? "active" : ""} onClick={() => setStudyPanel("notes")}><FiEdit3 /> Notes</button>
                        <button type="button" className={studyPanel === "assistant" ? "active" : ""} onClick={() => setStudyPanel("assistant")}><FiZap /> AI Assistant</button>
                        <button type="button" className={studyPanel === "quiz" ? "active" : ""} onClick={() => setStudyPanel("quiz")}><FiAward /> Quiz</button>
                      </div>
 
                      {studyPanel === "notes" ? (() => {
                        const activeSessionNum = selectedVideo ? (modules.findIndex((item) => item.id === selectedVideo?.id) + 1) : 1;
                        const detailedNotes = getDetailedCourseNotes(course?.title || "", activeSessionNum);

                        return (
                          <div className="study-notes">
                            <div className="study-panel-heading">
                              <div><span>Synced workspace</span><h2>Lesson & Session Notes</h2></div>
                              <button type="button" onClick={handleNewNote}><FiPlus /> Add note</button>
                            </div>
                            <p className="study-helper">Dynamic timestamped notes & detailed session reference notes.</p>
                            
                            {/* User Timestamped Notes */}
                            <div className="note-list mb-4">
                              <h6 className="text-white fw-bold mb-2 small" style={{ color: '#818cf8' }}>Your Timestamp Notes</h6>
                              {notes.length === 0 ? (
                                <div className="note-item text-secondary small">No custom timestamp notes yet. Click "+ Add note" to capture timestamps.</div>
                              ) : notes.map((note, index) => (
                                <article className="note-item" key={`${note.time}-${index}`}><strong>{fmtTime(note.time)}</strong><p>{note.text}</p></article>
                              ))}
                            </div>

                            {/* Comprehensive Session Notes */}
                            <div className="pt-3 border-top border-secondary-subtle">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="text-white fw-bold m-0 d-flex align-items-center gap-2" style={{ fontSize: '13.5px' }}>
                                  <FiBookOpen style={{ color: '#06b6d4' }} /> Session {activeSessionNum} Detailed Notes
                                </h6>
                                <span className="badge bg-dark text-cyan border border-info" style={{ fontSize: '10px' }}>
                                  {detailedNotes.sessionTitle}
                                </span>
                              </div>
                              <p className="small text-secondary mb-3">{detailedNotes.summary}</p>

                              <div className="d-flex flex-column gap-3">
                                {detailedNotes.sections.map((sec, sIdx) => (
                                  <div key={sIdx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                                      {sec.heading}
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.85)', lineHeight: '1.5', margin: 0 }}>
                                      {sec.content}
                                    </p>

                                    {sec.codeSnippet && (
                                      <pre style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px', marginTop: '10px', fontSize: '11px', color: '#a7f3d0', overflowX: 'auto' }}>
                                        <code>{sec.codeSnippet}</code>
                                      </pre>
                                    )}

                                    {sec.takeaways && sec.takeaways.length > 0 && (
                                      <ul className="mt-2 mb-0 ps-3 small text-secondary" style={{ fontSize: '11.5px' }}>
                                        {sec.takeaways.map((t, tIdx) => (
                                          <li key={tIdx} style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '3px' }}>{t}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })() : studyPanel === "assistant" ? (
                        <div className="assistant-panel">
                          <div className="assistant-heading">
                            <span className="assistant-orb"><FiMessageCircle /></span>
                            <div><h2>Learning assistant</h2><p>Ask about this lesson</p></div>
                            <span className="assistant-online">Online</span>
                          </div>
                          <div className="assistant-prompts">
                            {["Summarize this lesson", "Quiz me", "Explain the key idea"].map((prompt) => (
                              <button key={prompt} type="button" onClick={() => setChatInput(prompt)}>{prompt}</button>
                            ))}
                          </div>
                          <div className="chat-messages">
                            {chatMessages.map((message, index) => (
                              <div key={index} className={`chat-message ${message.role}`}>
                                {message.role === "assistant" && <span className="chat-avatar"><FiZap /></span>}
                                <p>{message.text}</p>
                              </div>
                            ))}
                            {chatLoading && <div className="chat-message assistant"><span className="chat-avatar"><FiZap /></span><p>Thinking…</p></div>}
                          </div>
                          <form className="chat-composer" onSubmit={handleChatSubmit}>
                            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask anything about this lesson…" />
                            <button type="submit" aria-label="Send message" disabled={chatLoading || !chatInput.trim()}><FiSend /></button>
                          </form>
                        </div>
                      ) : (
                         <div className="study-quiz">
                           <div className="study-panel-heading">
                             <div><span>Interactive Assessment</span><h2>Session Quiz</h2></div>
                             <span className="badge-difficulty difficulty-intermediate" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                               Session {selectedVideo ? (modules.findIndex((item) => item.id === selectedVideo?.id) + 1) : 1}
                             </span>
                           </div>

                           {(selectedVideo && (completedQuizzes[selectedVideo.id] || quizPassed)) ? (
                             <div className="quiz-passed-card text-center py-4 px-3" style={{ background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: '12px', marginTop: '16px' }}>
                               <span style={{ fontSize: '48px' }}>🏆</span>
                               <h4 style={{ color: '#16a34a', fontWeight: '700', marginTop: '12px' }}>Assessment Passed!</h4>
                               <p className="small mb-4" style={{ color: '#bae6fd' }}>You have successfully answered the quiz for this session. Keep up the great work!</p>
                               <button type="button" className="btn btn-outline-success btn-sm w-100" onClick={handleQuizRetake}>Retake Assessment</button>
                             </div>
                           ) : (
                             (() => {
                               const activeSessionNum = selectedVideo ? (modules.findIndex((item) => item.id === selectedVideo?.id) + 1) : 1;
                               const activeQuestions = getSessionQuizQuestions(course?.title || "", activeSessionNum);
                               return (
                                 <form onSubmit={(e) => handleQuizSubmit(e, activeQuestions)} className="quiz-form-inline mt-3">
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                                     {activeQuestions.map((qObj, qIdx) => (
                                       <div key={qIdx} className="quiz-question-box" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 14px' }}>
                                         <p className="small fw-semibold mb-2" style={{ color: '#ffffff', fontSize: '13.5px', lineHeight: '1.4' }}>{qIdx + 1}. {qObj.q}</p>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                           {qObj.opts.map((opt, oIdx) => {
                                             const isSelected = quizAnswers[qIdx] === oIdx;
                                             return (
                                               <label key={oIdx} className="small d-flex align-items-center gap-2 p-2 rounded cursor-pointer" style={{
                                                 background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#131c31',
                                                 border: '1px solid',
                                                 borderColor: isSelected ? '#38bdf8' : '#1e293b',
                                                 color: isSelected ? '#ffffff' : '#bae6fd',
                                                 fontWeight: isSelected ? '600' : 'normal',
                                                 transition: 'all 0.15s ease',
                                                 cursor: 'pointer'
                                               }}>
                                                 <input
                                                   type="radio"
                                                   name={`inline-q-${qIdx}`}
                                                   checked={isSelected}
                                                   onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                                   style={{ accentColor: '#38bdf8' }}
                                                 />
                                                 {opt}
                                               </label>
                                             );
                                           })}
                                         </div>
                                       </div>
                                     ))}
                                   </div>

                                   {quizSubmitted && !quizPassed && (
                                     <div className="small text-danger d-flex align-items-center gap-2 mt-3 p-2 rounded border border-danger-subtle" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                                       <FiAlertCircle /> Some answers are incorrect. Try again!
                                     </div>
                                   )}

                                   <button type="submit" className="btn btn-premium-indigo btn-sm w-100 mt-3 py-2 fw-semibold">Submit Assessment</button>
                                 </form>
                               );
                             })()
                           )}
                         </div>
                       )}
                     </aside>
                  </section>
                </>
              )}

              {activeTab === "Reviews" && (
                <>
                  <h2>Reviews</h2>
                  <p>Learners rate this course {course.rating || "4.8"} for practical, beginner-friendly cybersecurity coverage.</p>
                </>
              )}
            </main>
          </div>

          {activeTab !== "Modules" && (
            <aside className="course-sidebar">
              <div className="course-sidebar-card">
                <div className="course-price">Free</div>
                <button
                  type="button"
                  onClick={enrollCourse}
                  className={isEnrolled ? "btn btn-success w-100 py-3" : "btn btn-premium-indigo w-100 py-3"}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? (
                    <>
                      <FiCheck className="me-2" /> Enrolled
                    </>
                  ) : (
                    "Enroll Now for Free"
                  )}
                </button>

                <div className="course-sidebar-list">
                  <span><FiClock /> {course.duration || "12h"} course duration</span>
                  <span><FiBookOpen /> Beginner friendly modules</span>
                  <span><FiAward /> Certificate eligible</span>
                  <span><FiStar /> {course.rating || "4.8"} learner rating</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

    </div>
  );
}

export default CourseDetails;
