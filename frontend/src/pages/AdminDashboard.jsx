import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { 
  FiHome, FiUsers, FiUser, FiBook, FiGrid, FiLayers, FiPlay, FiCpu, FiAward, 
  FiTrendingUp, FiVolume2, FiMessageSquare, FiFileText, FiSettings, FiLogOut, 
  FiSearch, FiBell, FiMail, FiSun, FiMoon, FiPlus, FiTrash2, FiEdit3, 
  FiX, FiCheckCircle, FiAlertTriangle, FiLock, 
  FiDatabase, FiHelpCircle, FiFilter, FiUploadCloud, FiChevronRight, 
  FiFolder, FiEye, FiDownload, FiSend, FiRefreshCw, FiBookOpen
} from "react-icons/fi";

function AdminDashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Settings / Theme
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Notification / Message overlays
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic Toast Helper
  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // -------------------------------------------------------------
  // RICH INITIAL MOCK DATA (stored in state for interactivity)
  // -------------------------------------------------------------
  
  // 1. Users list
  const [users, setUsers] = useState([]);

  // 2. Courses list
  const [courses, setCourses] = useState([]);

  // 3. Categories list
  const [categories, setCategories] = useState([
    { id: 1, name: "Artificial Intelligence", code: "AI", coursesCount: 2, icon: "FiCpu" },
    { id: 2, name: "Cybersecurity", code: "CY", coursesCount: 1, icon: "FiLock" },
    { id: 3, name: "Cloud Computing", code: "CC", coursesCount: 1, icon: "FiGlobe" },
    { id: 4, name: "Web Development", code: "WD", coursesCount: 1, icon: "FiGrid" },
    { id: 5, name: "Data Science", code: "DS", coursesCount: 1, icon: "FiTrendingUp" }
  ]);

  // 4. Video Library list
  const [videos, setVideos] = useState([
    { id: 1, title: "Foundations of Convolutional Neural Networks", size: "145 MB", duration: "18:45", category: "Artificial Intelligence", uploadedAt: "2026-06-25" },
    { id: 2, title: "Symmetric vs Asymmetric Encryption Deep Dive", size: "210 MB", duration: "25:30", category: "Cybersecurity", uploadedAt: "2026-06-22" },
    { id: 3, title: "Kubernetes Cluster Networking Configuration", size: "389 MB", duration: "42:15", category: "Cloud Computing", uploadedAt: "2026-06-18" },
    { id: 4, title: "Advanced State Management using Redux Toolkit", size: "172 MB", duration: "21:10", category: "Web Development", uploadedAt: "2026-06-12" }
  ]);

  // 5. Quizzes
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: "Neural Networks Quiz 1", courseId: 101, questionsCount: 10, attempts: 245, passRate: 78, avgScore: 82 },
    { id: 2, title: "OWASP Top 10 Vulnerabilities Check", courseId: 102, questionsCount: 15, attempts: 189, passRate: 85, avgScore: 88 },
    { id: 3, title: "AWS IAM Roles and Policies Test", courseId: 103, questionsCount: 8, attempts: 104, passRate: 64, avgScore: 71 }
  ]);

  // 6. Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Semester End Examinations Registration Open", body: "Students must register for the Emerging Tech practical examinations before July 15th.", type: "Important", date: "2026-07-01", sentTo: "All Students" },
    { id: 2, title: "AI Assistant Platform Integration Completed", body: "We have fully upgraded our chat agent with LLM capabilities. Check out the panel now.", type: "General", date: "2026-06-28", sentTo: "Everyone" },
    { id: 3, title: "New Certification Standards in CyberSecurity Course", body: "To obtain certificates, students must clear the practical labs with minimum 80%.", type: "Urgent", date: "2026-06-24", sentTo: "Enrolled Students" }
  ]);

  // 7. Feedback List
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, studentName: "K. Ramya Sree", course: "Cybersecurity & Cryptography", rating: 5, comment: "Amazing material. The labs are incredibly helpful for hands-on cryptographic logic.", date: "2026-07-01", type: "Review" },
    { id: 2, studentName: "M. Teja Prasanna", course: "Advanced AI & Deep Learning", rating: 4, comment: "Very detailed explanations. The GPU setup video had minor buffering, but overall top quality.", date: "2026-06-30", type: "Review" },
    { id: 3, studentName: "G. Anil Kumar", course: "Cloud Native Architectures", rating: 3, comment: "I faced issues deploying to AWS Localstack in Lesson 4. Can we get an updated setup script?", date: "2026-06-28", type: "Bug Report" }
  ]);

  // 8. Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New course enrollment: 12 students signed up for Deep Learning.", time: "10 mins ago", read: false },
    { id: 2, text: "Server Backup successfully executed and saved in S3.", time: "2 hours ago", read: false },
    { id: 3, text: "Dr. Sai Krishna submitted a new Module for review: 'Transformer Networks'.", time: "1 day ago", read: true }
  ]);

  // 9. Messages
  const [messages, setMessages] = useState([
    { id: 1, sender: "Prof. S. R. Chavali", text: "Shabira, I completed the exam questions for Data Science. Can you verify?", time: "15 mins ago", avatar: "SC" },
    { id: 2, sender: "Dr. Sai Krishna", text: "Need GPU allocation approval for Deep Learning course module labs.", time: "1 hour ago", avatar: "SK" }
  ]);

  // 10. Tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review video uploads for Cybersecurity course", done: false, priority: "High" },
    { id: 2, text: "Configure university SSO in Auth Settings", done: true, priority: "Medium" },
    { id: 3, text: "Audit certificate credentials template signature", done: false, priority: "Low" },
    { id: 4, text: "Publish feedback reports for academic council", done: false, priority: "Medium" }
  ]);

  const [stats, setStats] = useState(null);

  // -------------------------------------------------------------
  // DYNAMIC COMPONENT MODALS / CREATOR STATES
  // -------------------------------------------------------------
  
  // Modals visibility toggles
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  
  // Form values (Add User)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student", department: "", year: "1st Year", status: "active" });
  
  // Form values (Add Course)
  const [newCourse, setNewCourse] = useState({ title: "", category: "Artificial Intelligence", modules: 5, lessons: 15, rating: 5.0, status: "Published", thumbnail: "" });
  
  // Form values (Video Upload Simulator)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState({ title: "", category: "Artificial Intelligence", file: null });

  // Quiz Builder states
  const [quizBuilder, setQuizBuilder] = useState({ title: "", courseId: 101, questions: [{ text: "", type: "MCQ", options: ["", "", "", ""], answerIndex: 0, difficulty: "Medium" }] });

  // AI Assistant states
  const [aiPrompts, setAiPrompts] = useState([
    "Generate full syllabus outline for 'Blockchain Foundations'",
    "Create 5 MCQ questions with answers on 'Neural Networks'",
    "Write a platform announcement regarding 'Upcoming Maintenance Schedule'"
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { role: "assistant", content: "Hello! I am your AI Academic Assistant. I can generate course outlines, quiz questions, announcements, or analyze platform logs. Select one of the quick prompts or write your own below." }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Settings states
  const [settings, setSettings] = useState({
    uniName: "Jawaharlal Nehru Technological University - Gurajada, Vizianagaram (JNTUGV)",
    smtpHost: "smtp.jntugv.edu.in",
    smtpUser: "etlp-admin@jntugv.edu.in",
    smtpPass: "••••••••••••••••",
    primaryColor: "#4F46E5",
    secondaryColor: "#7C3AED",
    backupSchedule: "Daily",
    registrationAllowed: true,
    requireVerification: true
  });

  // -------------------------------------------------------------
  // DYNAMIC SIMULATIONS & TRIGGERS
  // -------------------------------------------------------------
  // Fetch real data on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, coursesRes, statsRes] = await Promise.all([
          API.get("/dashboard/users"),
          API.get("/courses"),
          API.get("/dashboard")
        ]);
        if (usersRes.data.success) {
          const normalizedUsers = usersRes.data.users.map(u => ({
            ...u,
            department: u.department || "Computer Science",
            year: u.year || "N/A",
            status: u.verified ? "active" : "unverified",
            enrolled: u.enrolled || 0,
            progress: u.progress || 0
          }));
          setUsers(normalizedUsers);
        }
        if (coursesRes.data.success) {
          const normalizedCourses = coursesRes.data.courses.map(c => ({
            ...c,
            modules: c.modules || 5,
            lessons: c.lessons || 15,
            enrolled: c.enrolled || 0,
            completion: c.completion || 0,
            rating: c.rating || 5.0,
            status: c.status || "Published"
          }));
          setCourses(normalizedCourses);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error", err);
      }
    };
    fetchAdminData();
  }, []);

  // 1. Add User logic
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      triggerToast("Please fill in name and email.", "error");
      return;
    }
    try {
      const res = await API.post("/auth/register", {
        name: newUser.name,
        email: newUser.email,
        password: "defaultpassword123",
        role: newUser.role
      });
      if (res.data.success) {
        const usersRes = await API.get("/dashboard/users");
        if (usersRes.data.success) {
          const normalizedUsers = usersRes.data.users.map(u => ({
            ...u,
            department: u.department || "Computer Science",
            year: u.year || "N/A",
            status: u.verified ? "active" : "unverified",
            enrolled: u.enrolled || 0,
            progress: u.progress || 0
          }));
          setUsers(normalizedUsers);
        }
        setShowAddUserModal(false);
        setNewUser({ name: "", email: "", role: "student", department: "", year: "1st Year", status: "active" });
        triggerToast(`User "${newUser.name}" successfully registered!`);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to register user.", "error");
    }
  };

  // Toggle user status (active/suspended)
  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "active" ? "suspended" : "active";
        triggerToast(`User status set to: ${nextStatus.toUpperCase()}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Delete user logic
  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      const res = await API.delete(`/dashboard/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter(u => u.id !== userId));
        triggerToast(`User "${userToDelete?.name || 'User'}" removed from platform.`, "error");
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to delete user.", "error");
    }
  };

  // 2. Add Course logic
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title) {
      triggerToast("Please provide a course title.", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description || "Course description.");
      formData.append("category", newCourse.category);
      
      const res = await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        const coursesRes = await API.get("/courses");
        if (coursesRes.data.success) {
          const normalizedCourses = coursesRes.data.courses.map(c => ({
            ...c,
            modules: c.modules || 5,
            lessons: c.lessons || 15,
            enrolled: c.enrolled || 0,
            completion: c.completion || 0,
            rating: c.rating || 5.0,
            status: c.status || "Published"
          }));
          setCourses(normalizedCourses);
        }
        setShowAddCourseModal(false);
        setNewCourse({ title: "", category: "Artificial Intelligence", modules: 5, lessons: 15, rating: 5.0, status: "Published", thumbnail: "" });
        triggerToast(`Course "${newCourse.title}" created successfully!`);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to create course.", "error");
    }
  };

  // Toggle course status (Published/Archived)
  const toggleCourseStatus = (courseId) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const nextStatus = c.status === "Published" ? "Archived" : "Published";
        triggerToast(`Course status updated to: ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Delete course logic
  const handleDeleteCourse = async (courseId) => {
    try {
      const courseToDelete = courses.find(c => c.id === courseId);
      const res = await API.delete(`/courses/${courseId}`);
      if (res.data.success) {
        setCourses(courses.filter(c => c.id !== courseId));
        triggerToast(`Course "${courseToDelete?.title || 'Course'}" deleted.`, "error");
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to delete course.", "error");
    }
  };

  // 3. Video Upload simulation
  const handleUploadVideo = (e) => {
    e.preventDefault();
    if (!uploadingVideo.title) {
      triggerToast("Please enter a video title.", "error");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newVid = {
              id: videos.length + 1,
              title: uploadingVideo.title,
              size: `${(Math.random() * 300 + 50).toFixed(1)} MB`,
              duration: `${Math.floor(Math.random() * 30) + 10}:${Math.floor(Math.random() * 50) + 10}`,
              category: uploadingVideo.category,
              uploadedAt: new Date().toISOString().split("T")[0]
            };
            setVideos([newVid, ...videos]);
            setIsUploading(false);
            setShowUploadVideoModal(false);
            setUploadingVideo({ title: "", category: "Artificial Intelligence", file: null });
            triggerToast(`Video "${newVid.title}" uploaded and transcoded!`);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // 4. Quiz creation logic
  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!quizBuilder.title) {
      triggerToast("Please provide a quiz title.", "error");
      return;
    }
    const newQuiz = {
      id: quizzes.length + 1,
      title: quizBuilder.title,
      courseId: Number(quizBuilder.courseId),
      questionsCount: quizBuilder.questions.length,
      attempts: 0,
      passRate: 100,
      avgScore: 0
    };
    setQuizzes([newQuiz, ...quizzes]);
    setShowCreateQuizModal(false);
    setQuizBuilder({ title: "", courseId: 101, questions: [{ text: "", type: "MCQ", options: ["", "", "", ""], answerIndex: 0, difficulty: "Medium" }] });
    triggerToast(`Quiz "${newQuiz.title}" successfully compiled and assigned.`);
  };

  // 5. Send announcement logic
  const [announceForm, setAnnounceForm] = useState({ title: "", body: "", type: "Important", target: "All Students", push: true, email: true });
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!announceForm.title || !announceForm.body) {
      triggerToast("Please fill in the announcement content.", "error");
      return;
    }
    const newAnn = {
      id: announcements.length + 1,
      title: announceForm.title,
      body: announceForm.body,
      type: announceForm.type,
      date: new Date().toISOString().split("T")[0],
      sentTo: announceForm.target
    };
    setAnnouncements([newAnn, ...announcements]);
    setAnnounceForm({ title: "", body: "", type: "Important", target: "All Students", push: true, email: true });
    
    let dispatchMsg = "Announcement published.";
    if (announceForm.push && announceForm.email) dispatchMsg += " Dispatched via Email & Mobile Push notification to 1,245 users.";
    else if (announceForm.email) dispatchMsg += " Dispatched via Email notification.";
    else if (announceForm.push) dispatchMsg += " Dispatched via Mobile Push notification.";
    
    triggerToast(dispatchMsg);
  };

  // 6. Reports download simulation
  const handleDownloadReport = (reportType, format) => {
    triggerToast(`Compiling detailed statistics for ${reportType} report...`);
    setTimeout(() => {
      // Simulate download trigger by creating mock notification
      triggerToast(`Successfully downloaded ETLP_${reportType}_Report.${format.toLowerCase()}`, "success");
    }, 1500);
  };

  // 7. AI Assistant simulated responder
  const handleAiQuery = async (queryText) => {
    const query = queryText || aiInput;
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    setAiChat(prev => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      let replyContent = "";
      const normalizedQuery = query.toLowerCase();

      if (normalizedQuery.includes("outline") || normalizedQuery.includes("blockchain")) {
        replyContent = `Here is a high-fidelity course outline generated for **Blockchain Foundations & Smart Contracts**:\n\n` +
          `* **Module 1: Decentralization Paradigms** (Syllabus, Byzantine Fault Tolerance)\n` +
          `* **Module 2: Cryptographic Primitives** (Hash chains, Merkle trees, public key pairs)\n` +
          `* **Module 3: Smart Contract Engineering** (Solidity structure, state variables, security audits)\n` +
          `* **Module 4: Consensus Architectures** (Proof of Work vs. Proof of Stake vs. Proof of History)\n` +
          `* **Module 5: Real-world Applications** (DeFi protocols, decentralized supply chains, identity management)\n\n` +
          `Would you like me to compile quiz questions for Module 1 or generate learning resources?`;
      } else if (normalizedQuery.includes("quiz") || normalizedQuery.includes("neural")) {
        replyContent = `Here is a set of 3 MCQ questions compiled on **Neural Networks & Deep Learning**:\n\n` +
          `**Q1. Which activation function helps prevent vanishing gradient problems in deep neural networks?**\n` +
          `a) Sigmoid\n` +
          `b) Tanh\n` +
          `c) ReLU (Rectified Linear Unit) [Correct]\n` +
          `d) Step Function\n\n` +
          `**Q2. What is the role of dropout layers in Neural Networks?**\n` +
          `a) Speed up calculation\n` +
          `b) Regularize network and prevent overfitting [Correct]\n` +
          `c) Add non-linearity\n` +
          `d) Initialize random weights\n\n` +
          `**Q3. Epoch describes:**\n` +
          `a) One full forward & backward pass of all training examples [Correct]\n` +
          `b) One update to weight variables\n` +
          `c) Batch size divided by learning rate\n` +
          `d) None of the above\n\n` +
          `Would you like to import this set directly into the ETLP Quiz Builder?`;
      } else if (normalizedQuery.includes("maintenance") || normalizedQuery.includes("announcement")) {
        replyContent = `Here is a professional draft for your maintenance announcement:\n\n` +
          `**Subject: Scheduled System Upgrade & Maintenance: ETLP Portal**\n\n` +
          `*Dear JNTUGV Students and Faculty Members,*\n\n` +
          `*Please note that the Emerging Technologies Learning Portal (ETLP) will undergo scheduled backend updates on **Sunday, July 5th, from 02:00 AM to 05:00 AM IST** to support enhanced video rendering speeds. During this window, access to course videos and online quiz assessments may be temporarily disrupted.*\n\n` +
          `*We apologize for any inconvenience. Thank you for your continued partnership in digital excellence.*\n\n` +
          `*Warm regards,\nETLP Operations Center, JNTUGV.*`;
      } else {
        replyContent = `I have completed an audit of the platform logs. Insights:\n\n` +
          `- **Cybersecurity Course** has a 95% satisfaction rating but has low completion rates in Module 4. Recommendation: Review and simplify Lesson 4 Lab configuration script.\n` +
          `- **Vocal Activity Spike**: Platform traffic peaks daily between 7:00 PM and 10:00 PM. System load remains well within threshold limits (34% CPU).\n` +
          `- Let me know if you would like me to analyze other components!`;
      }

      setAiChat(prev => [...prev, { role: "assistant", content: replyContent }]);
      setAiLoading(false);
    }, 1500);
  };

  // -------------------------------------------------------------
  // RENDER GRAPHIC SVG CHARTS (Modern, zero dependencies)
  // -------------------------------------------------------------
  
  // 1. Line/Area Chart for Growth
  const renderStudentGrowthChart = () => {
    return (
      <svg viewBox="0 0 500 200" className="w-100" style={{ maxHeight: "180px" }}>
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Gridlines */}
        <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Area fill */}
        <path 
          d="M 40 170 C 90 140, 120 110, 160 120 C 200 130, 240 80, 280 90 C 320 100, 360 40, 400 50 C 440 60, 460 30, 480 25 L 480 170 Z" 
          fill="url(#growthGrad)" 
        />
        
        {/* Data Line */}
        <path 
          d="M 40 170 C 90 140, 120 110, 160 120 C 200 130, 240 80, 280 90 C 320 100, 360 40, 400 50 C 440 60, 460 30, 480 25" 
          fill="none" 
          stroke="#4F46E5" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
        
        {/* Data points */}
        <circle cx="160" cy="120" r="4.5" fill="#06B6D4" stroke="#fff" strokeWidth="1.5" />
        <circle cx="280" cy="90" r="4.5" fill="#06B6D4" stroke="#fff" strokeWidth="1.5" />
        <circle cx="400" cy="50" r="4.5" fill="#06B6D4" stroke="#fff" strokeWidth="1.5" />
        <circle cx="480" cy="25" r="4.5" fill="#7C3AED" stroke="#fff" strokeWidth="1.5" />

        {/* Labels */}
        <text x="40" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">Jan</text>
        <text x="120" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">Feb</text>
        <text x="200" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">Mar</text>
        <text x="280" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">Apr</text>
        <text x="360" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">May</text>
        <text x="440" y="190" fill="#bae6fd" fontSize="10" textAnchor="middle">Jun</text>
        
        <text x="30" y="173" fill="#bae6fd" fontSize="9" textAnchor="end">0</text>
        <text x="30" y="103" fill="#bae6fd" fontSize="9" textAnchor="end">500</text>
        <text x="30" y="23" fill="#bae6fd" fontSize="9" textAnchor="end">1k</text>
      </svg>
    );
  };

  // 2. Donut Chart for Categories
  const renderCategoryDonut = () => {
    // 5 categories. Percentages: AI (35%), Cyber (25%), Cloud (20%), Web (15%), Data (5%)
    // Circumference = 2 * PI * r = 2 * 3.14 * 50 = 314
    return (
      <svg viewBox="0 0 200 200" className="w-100" style={{ maxHeight: "180px" }}>
        {/* AI Segment: value=35, offset=0 */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#4F46E5" strokeWidth="24" 
          strokeDasharray="109.9 314" strokeDashoffset="0" transform="rotate(-90 100 100)" />
        {/* Cyber: value=25, offset=35 */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#06B6D4" strokeWidth="24" 
          strokeDasharray="78.5 314" strokeDashoffset="-109.9" transform="rotate(-90 100 100)" />
        {/* Cloud: value=20, offset=60 */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#7C3AED" strokeWidth="24" 
          strokeDasharray="62.8 314" strokeDashoffset="-188.4" transform="rotate(-90 100 100)" />
        {/* Web: value=15, offset=80 */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#22C55E" strokeWidth="24" 
          strokeDasharray="47.1 314" strokeDashoffset="-251.2" transform="rotate(-90 100 100)" />
        {/* Data: value=5, offset=95 */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#F59E0B" strokeWidth="24" 
          strokeDasharray="15.7 314" strokeDashoffset="-298.3" transform="rotate(-90 100 100)" />
        
        {/* Center label */}
        <circle cx="100" cy="100" r="34" fill="#131a2c" />
        <text x="100" y="96" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">1,245</text>
        <text x="100" y="112" fill="#64748b" fontSize="8" textAnchor="middle">Enrollments</text>
      </svg>
    );
  };

  // 3. Bar Chart for Quiz Performance
  const renderQuizBarChart = () => {
    return (
      <svg viewBox="0 0 500 220" className="w-100" style={{ maxHeight: "180px" }}>
        {/* Gridlines */}
        <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Bar 1 */}
        <rect x="80" y="54" width="36" height="116" rx="4" fill="url(#blueBarGrad)" />
        <text x="98" y="44" fill="#06B6D4" fontSize="10" textAnchor="middle" fontWeight="600">82%</text>
        
        {/* Bar 2 */}
        <rect x="180" y="44" width="36" height="126" rx="4" fill="url(#purpleBarGrad)" />
        <text x="198" y="34" fill="#7C3AED" fontSize="10" textAnchor="middle" fontWeight="600">88%</text>

        {/* Bar 3 */}
        <rect x="280" y="86" width="36" height="84" rx="4" fill="url(#blueBarGrad)" />
        <text x="298" y="76" fill="#06B6D4" fontSize="10" textAnchor="middle" fontWeight="600">71%</text>

        {/* Bar 4 */}
        <rect x="380" y="34" width="36" height="136" rx="4" fill="url(#greenBarGrad)" />
        <text x="398" y="24" fill="#22C55E" fontSize="10" textAnchor="middle" fontWeight="600">95%</text>

        {/* Labels */}
        <text x="98" y="192" fill="#bae6fd" fontSize="9" textAnchor="middle">AI Quiz 1</text>
        <text x="198" y="192" fill="#bae6fd" fontSize="9" textAnchor="middle">Cyber Check</text>
        <text x="298" y="192" fill="#bae6fd" fontSize="9" textAnchor="middle">AWS Roles</text>
        <text x="398" y="192" fill="#bae6fd" fontSize="9" textAnchor="middle">React Basics</text>

        <text x="40" y="173" fill="#bae6fd" fontSize="9" textAnchor="end">0%</text>
        <text x="40" y="123" fill="#bae6fd" fontSize="9" textAnchor="end">50%</text>
        <text x="40" y="23" fill="#bae6fd" fontSize="9" textAnchor="end">100%</text>

        <defs>
          <linearGradient id="blueBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="greenBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // -------------------------------------------------------------
  // JSX MAIN LAYOUT
  // -------------------------------------------------------------
  return (
    <div className={`d-flex min-vh-100 ${isDarkMode ? "bg-dark-mode" : "bg-light-mode"}`} style={{ 
      backgroundColor: "#0a0f1d",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="position-fixed top-0 start-50 translate-middle-x z-3"
          >
            <div className={`glass-panel px-4 py-3 border-start border-4 d-flex align-items-center gap-3 shadow-lg ${
              toast.type === "success" ? "border-success bg-opacity-95" : "border-danger bg-opacity-95"
            }`} style={{ background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}>
              {toast.type === "success" ? <FiCheckCircle className="text-success" size={20} /> : <FiAlertTriangle className="text-danger" size={20} />}
              <span className={`fw-semibold ${isDarkMode ? "text-white" : "text-dark"}`}>{toast.message}</span>
              <button className="btn btn-sm p-0 border-0 ms-2" onClick={() => setToast(null)}>
                <FiX className={isDarkMode ? "text-muted" : "text-secondary"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          LEFT SIDEBAR NAVIGATION (Width: 280px)
         ------------------------------------------------------------- */}
      <div className="d-none d-lg-flex flex-column flex-shrink-0 p-3" style={{ 
        width: "280px", 
        borderRight: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0,0,0,0.08)",
        background: isDarkMode ? "rgba(11, 15, 25, 0.6)" : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px)"
      }}>
        {/* Sidebar Brand Header */}
        <div className="d-flex align-items-center gap-2 mb-4 px-2 py-1">
          <div className="p-2 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
            <FiBookOpen size={24} />
          </div>
          <div>
            <h5 className="fw-bold mb-0 tracking-tight text-gradient" style={{ 
              background: "linear-gradient(to right, #06B6D4, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>ETLP Admin</h5>
            <small className="text-muted fw-semibold uppercase" style={{ fontSize: "8.5px" }}>JNTUGV Learning Portal</small>
          </div>
        </div>

        {/* Sidebar Menu Scroll */}
        <div className="overflow-y-auto flex-grow-1 pe-1" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <div className="nav nav-pills flex-column gap-1">
            
            <small className="text-muted fw-bold px-2 mb-1 text-uppercase tracking-wider" style={{ fontSize: "10px" }}>Console Menu</small>
            {[
              { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
              { id: "users", label: "Users Management", icon: <FiUsers /> },
              { id: "students", label: "Students Directory", icon: <FiUser /> },
              { id: "courses", label: "Courses Catalog", icon: <FiBook /> }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link text-start d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 transition ${
                  activeTab === item.id 
                    ? "text-white active-sidebar-glow shadow-sm" 
                    : (isDarkMode ? "text-secondary hover-bg-dark" : "text-dark hover-bg-light")
                }`}
                style={{ 
                  background: activeTab === item.id ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "transparent",
                  fontSize: "14px",
                  fontWeight: activeTab === item.id ? "600" : "500"
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

          </div>
        </div>
          
        {/* Sidebar Footer */}
        <div className="mt-auto border-top pt-3 px-2 d-flex flex-column gap-2" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
          <button 
            onClick={() => {
              triggerToast("Logged out successfully! Redirecting...");
              setTimeout(() => window.location.href = "/login", 1500);
            }}
            className="btn btn-sm btn-outline-danger text-start d-flex align-items-center gap-2 px-2 py-1.5 rounded-3 border-0"
          >
            <FiLogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          RIGHT PAGE WRAPPER (Top Bar + Main content)
         ------------------------------------------------------------- */}
      <div className="d-flex flex-column flex-grow-1 min-vh-100 overflow-x-hidden">
        
        {/* -------------------------------------------------------------
            TOP NAVIGATION BAR
           ------------------------------------------------------------- */}
        <header className="d-flex align-items-center justify-content-between px-4" style={{ 
          height: "70px", 
          borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0,0,0,0.08)",
          background: isDarkMode ? "rgba(11, 15, 25, 0.3)" : "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)"
        }}>
          {/* Global Search Bar */}
          <div className="position-relative d-flex align-items-center" style={{ width: "320px" }}>
            <FiSearch className="position-absolute start-3 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search users, courses, video tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control px-5 rounded-pill border-0"
              style={{ 
                height: "38px", 
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)",
                color: isDarkMode ? "#fff" : "#000",
                fontSize: "13.5px"
              }}
            />
          </div>

          {/* Action Items Widgets */}
          <div className="d-flex align-items-center gap-3">
            {/* Dark/Light Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`btn rounded-pill p-2 border-0 d-flex align-items-center justify-content-center ${isDarkMode ? "btn-dark text-cyan" : "btn-light text-warning"}`}
              title="Toggle theme preview"
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Messages Quick View */}
            <div className="position-relative">
              <button 
                onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }} 
                className="btn btn-outline-secondary rounded-pill p-2 border-0 position-relative text-white"
              >
                <FiMail className={isDarkMode ? "text-secondary" : "text-dark"} size={19} />
                <span className="position-absolute top-1 start-7 translate-middle badge rounded-pill bg-pink" style={{ fontSize: "7px" }}>2</span>
              </button>
              
              {/* Messages dropdown */}
              {showMessages && (
                <div className="position-absolute end-0 mt-2 glass-panel p-3 rounded-4 shadow-lg z-3" style={{ 
                  width: "300px", 
                  background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.98)" 
                }}>
                  <h6 className={`fw-bold border-bottom pb-2 mb-2 d-flex justify-content-between ${isDarkMode ? "text-white border-secondary" : "text-dark"}`}>
                    <span>Direct Messages</span>
                    <small className="text-cyan cursor-pointer" onClick={() => triggerToast("All marked as read")}>Mark all read</small>
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {messages.map(msg => (
                      <div key={msg.id} className="d-flex gap-2 p-2 rounded-3 hover-bg-dark cursor-pointer">
                        <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", fontSize: "11px" }}>
                          {msg.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="d-flex justify-content-between">
                            <span className={`fw-bold small ${isDarkMode ? "text-white" : "text-dark"}`}>{msg.sender}</span>
                            <span className="text-muted" style={{ fontSize: "9px" }}>{msg.time}</span>
                          </div>
                          <p className="text-muted mb-0 text-truncate" style={{ fontSize: "10.5px" }}>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications panel dropdown */}
            <div className="position-relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }} 
                className="btn btn-outline-secondary rounded-pill p-2 border-0 position-relative text-white"
              >
                <FiBell className={isDarkMode ? "text-secondary" : "text-dark"} size={19} />
                <span className="position-absolute top-1 start-7 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "7px" }}>2</span>
              </button>
              
              {showNotifications && (
                <div className="position-absolute end-0 mt-2 glass-panel p-3 rounded-4 shadow-lg z-3" style={{ 
                  width: "320px", 
                  background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.98)" 
                }}>
                  <h6 className={`fw-bold border-bottom pb-2 mb-2 d-flex justify-content-between ${isDarkMode ? "text-white border-secondary" : "text-dark"}`}>
                    <span>System Alerts</span>
                    <small className="text-cyan cursor-pointer" onClick={() => triggerToast("Cleared all alerts")}>Clear all</small>
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {notifications.map(n => (
                      <div key={n.id} className="d-flex gap-2 p-2 rounded-3 hover-bg-dark cursor-pointer">
                        <div className="bg-success bg-opacity-15 text-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                          <FiCheckCircle size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className={`mb-1 small ${isDarkMode ? "text-white" : "text-dark"}`} style={{ fontSize: "11px" }}>{n.text}</p>
                          <span className="text-muted" style={{ fontSize: "9px" }}>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="position-relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }} 
                className="btn p-0 border-0 rounded-circle"
                style={{ width: "38px", height: "38px", overflow: "hidden" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                  alt="Admin" 
                  className="w-100 h-100 object-fit-cover"
                />
              </button>
              
              {showProfileMenu && (
                <div className="position-absolute end-0 mt-2 glass-panel p-3 rounded-4 shadow-lg z-3" style={{ 
                  width: "220px", 
                  background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.98)" 
                }}>
                  <div className="text-center border-bottom pb-3 mb-2" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                    <h6 className={`fw-bold mb-0 ${isDarkMode ? "text-white" : "text-dark"}`}>Shabira Banu</h6>
                    <small className="text-muted">Platform Administrator</small>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <button onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }} className="btn btn-sm text-start d-flex align-items-center gap-2 hover-bg-dark border-0 py-2 rounded-3 text-secondary">
                      <FiUser size={14} /> My Profile
                    </button>
                    <button onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }} className="btn btn-sm text-start d-flex align-items-center gap-2 hover-bg-dark border-0 py-2 rounded-3 text-secondary">
                      <FiSettings size={14} /> Account Settings
                    </button>
                    <button onClick={() => { triggerToast("Logged out"); window.location.href = "/login"; }} className="btn btn-sm text-start d-flex align-items-center gap-2 hover-bg-dark border-0 py-2 rounded-3 text-danger">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* -------------------------------------------------------------
            MAIN VIEW PORT (DYNAMICS BASED ON TAB)
           ------------------------------------------------------------- */}
        <main className="flex-grow-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)" }}>
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header section with quick action buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
                <div>
                  <h1 className="fw-bold mb-1">Academic Control Panel</h1>
                  <p className="text-muted mb-0">Overview of Emerging Technologies Learning Portal operations (JNTUGV).</p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button onClick={() => setShowAddCourseModal(true)} className="btn btn-premium-indigo py-2 px-3 rounded-pill shadow-sm d-flex align-items-center gap-2">
                    <FiPlus /> Create Course
                  </button>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="row g-3 mb-4">
                {[
                  { title: "Total Students", value: stats?.totalStudents || 0, color: "primary" },
                  { title: "Total Courses", value: stats?.totalCourses || 0, color: "info" },
                  { title: "Total Enrollments", value: stats?.totalEnrollments || 0, color: "warning" }
                ].map((stat, idx) => (
                  <div className="col-12 col-md-4" key={idx}>
                    <motion.div whileHover={{ y: -4 }} className="glass-panel p-3 h-100 d-flex flex-column justify-content-between" style={{
                      borderLeft: `4px solid ${
                        stat.color === "primary" ? "#4F46E5" : stat.color === "success" ? "#22C55E" : stat.color === "info" ? "#06B6D4" : "#F59E0B"
                      }`
                    }}>
                      <div className="mb-1">
                        <span className="text-muted fw-bold tracking-wider text-uppercase" style={{ fontSize: "10px" }}>{stat.title}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-end">
                        <h3 className="fw-bold mb-0 text-white">{stat.value}</h3>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Recent Registrations (Using stats.recentUsers) */}
              <div className="glass-panel p-4 rounded-4 shadow-lg mb-4">
                <h5 className="fw-bold text-white mb-4">Recent Student & Faculty Registrations</h5>
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                    <thead>
                      <tr className="border-secondary text-secondary">
                        <th scope="col" className="ps-4">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col" className="pe-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">No recent registrations.</td>
                        </tr>
                      ) : (
                        stats.recentUsers.map((regUser) => (
                          <tr key={regUser.id} className="border-secondary">
                            <td className="ps-4 fw-bold text-white">{regUser.name}</td>
                            <td>{regUser.email}</td>
                            <td>
                              <span className={`badge ${
                                regUser.role === 'admin' ? 'bg-danger' : regUser.role === 'faculty' ? 'bg-success' : 'bg-primary'
                              }`} style={{ textTransform: 'capitalize' }}>
                                {regUser.role}
                              </span>
                            </td>
                            <td className="pe-4">{new Date(regUser.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="fw-bold mb-1">Users Directory</h1>
                  <p className="text-muted mb-0">Administer student details, faculty profiles, and credential statuses.</p>
                </div>
                <button onClick={() => setShowAddUserModal(true)} className="btn btn-premium-indigo rounded-pill py-2 px-4 shadow-sm d-flex align-items-center gap-2">
                  <FiPlus /> Add User
                </button>
              </div>

              {/* Filters Box */}
              <div className="glass-panel p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <FiFilter className="text-muted" />
                  <span className="small fw-semibold text-muted">Filter Role:</span>
                  <select className="form-select form-select-sm border-0 bg-transparent text-white" style={{ width: "130px" }} onChange={(e) => triggerToast(`Filtered: ${e.target.value}`)}>
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>
                
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => triggerToast("Reset filters")}>Reset</button>
                  <button className="btn btn-sm btn-premium-cyan py-1" onClick={() => triggerToast("Filters applied")}>Apply Filters</button>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-panel overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0" style={{ color: isDarkMode ? "#cbd5e1" : "#1e293b" }}>
                    <thead>
                      <tr className="border-bottom" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <th className="text-muted fw-semibold py-3 px-4">Name</th>
                        <th className="text-muted fw-semibold py-3">Role</th>
                        <th className="text-muted fw-semibold py-3">Department</th>
                        <th className="text-muted fw-semibold py-3">Year</th>
                        <th className="text-muted fw-semibold py-3">Status</th>
                        <th className="text-muted fw-semibold py-3 text-center">Courses</th>
                        <th className="text-muted fw-semibold py-3">Progress</th>
                        <th className="text-muted fw-semibold py-3 text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-bottom" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                          <td className="py-3 px-4">
                            <div>
                              <div className={`fw-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{u.name}</div>
                              <small className="text-muted text-xs">{u.email}</small>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`badge ${
                              u.role === "admin" ? "bg-indigo" : u.role === "faculty" ? "bg-success" : "bg-secondary"
                            }`} style={{ textTransform: "capitalize", fontSize: "9px" }}>{u.role}</span>
                          </td>
                          <td className="py-3">{u.department}</td>
                          <td className="py-3 text-muted">{u.year}</td>
                          <td className="py-3">
                            <span className={`badge bg-opacity-15 ${
                              u.status === "active" ? "bg-success text-success" : "bg-danger text-danger"
                            }`} style={{ fontSize: "9px" }}>{u.status}</span>
                          </td>
                          <td className="py-3 text-center fw-bold">{u.enrolled}</td>
                          <td className="py-3">
                            {u.role === "student" ? (
                              <div className="d-flex align-items-center gap-2" style={{ width: "120px" }}>
                                <div className="progress flex-grow-1" style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.08)" }}>
                                  <div className="progress-bar bg-cyan" style={{ width: `${u.progress}%` }}></div>
                                </div>
                                <span className="text-muted" style={{ fontSize: "10.5px" }}>{u.progress}%</span>
                              </div>
                            ) : <span className="text-muted">-</span>}
                          </td>
                          <td className="py-3 text-end px-4">
                            <div className="d-flex justify-content-end gap-1.5">
                              <button onClick={() => toggleUserStatus(u.id)} className="btn btn-sm btn-outline-warning border-0" title={u.status === "active" ? "Suspend user" : "Activate user"}>
                                <FiLock size={14} />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="btn btn-sm btn-outline-danger border-0" title="Delete user">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: STUDENTS DIRECTORY */}
          {activeTab === "students" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4">
                <h1 className="fw-bold mb-1">Students Directory</h1>
                <p className="text-muted">Filtered directory tracking only academic progress and student enrollment trends.</p>
              </div>

              <div className="glass-panel overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0" style={{ color: isDarkMode ? "#cbd5e1" : "#1e293b" }}>
                    <thead>
                      <tr className="border-bottom" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <th className="text-muted fw-semibold py-3 px-4">Student Name</th>
                        <th className="text-muted fw-semibold py-3">Year / Batch</th>
                        <th className="text-muted fw-semibold py-3">Department</th>
                        <th className="text-muted fw-semibold py-3">Courses Enrolled</th>
                        <th className="text-muted fw-semibold py-3">Average Completion Progress</th>
                        <th className="text-muted fw-semibold py-3">Status</th>
                        <th className="text-muted fw-semibold py-3 text-end px-4">View Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === "student").map(u => (
                        <tr key={u.id} className="border-bottom" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                          <td className="py-3 px-4 fw-bold">{u.name}</td>
                          <td className="py-3 text-muted">{u.year}</td>
                          <td className="py-3">{u.department}</td>
                          <td className="py-3 fw-bold text-center">{u.enrolled}</td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2" style={{ width: "200px" }}>
                              <div className="progress flex-grow-1" style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.08)" }}>
                                <div className="progress-bar bg-indigo" style={{ width: `${u.progress}%` }}></div>
                              </div>
                              <span className="text-muted fw-bold" style={{ fontSize: "11px" }}>{u.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`badge ${u.status === "active" ? "bg-success" : "bg-danger"}`} style={{ fontSize: "9px" }}>{u.status}</span>
                          </td>
                          <td className="py-3 text-end px-4">
                            <button onClick={() => triggerToast(`Navigating to ${u.name}'s details page`)} className="btn btn-sm btn-premium-cyan py-1 px-3">
                              <FiEye size={12} className="me-1" /> View Progress
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: COURSES MANAGEMENT */}
          {activeTab === "courses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="fw-bold mb-1">Course Catalog</h1>
                  <p className="text-muted">Launch new emerging technology syllabi, publish curricula, and track enrollment metrics.</p>
                </div>
                <button onClick={() => setShowAddCourseModal(true)} className="btn btn-premium-indigo rounded-pill py-2 px-4 shadow-sm d-flex align-items-center gap-2">
                  <FiPlus /> New Course
                </button>
              </div>

              {/* Course Grid */}
              <div className="row g-4">
                {courses.map(course => (
                  <div className="col-12 col-md-6 col-lg-4" key={course.id}>
                    <motion.div whileHover={{ y: -4 }} className="glass-panel h-100 overflow-hidden d-flex flex-column">
                      {/* Image section */}
                      <div className="position-relative" style={{ height: "170px" }}>
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-100 h-100 object-fit-cover"
                        />
                        <span className="position-absolute top-3 end-3 badge bg-dark bg-opacity-75 text-cyan py-1.5 px-2.5 rounded-3" style={{ fontSize: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {course.category}
                        </span>
                      </div>

                      {/* Info section */}
                      <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-2 lh-base" style={{ fontSize: "15px" }}>{course.title}</h6>
                          <div className="d-flex gap-3 text-muted mb-3" style={{ fontSize: "12px" }}>
                            <span><strong>{course.modules}</strong> Modules</span>
                            <span>•</span>
                            <span><strong>{course.lessons}</strong> Lessons</span>
                            <span>•</span>
                            <span>★ {course.rating}</span>
                          </div>
                        </div>

                        <div>
                          {/* Enrollment details */}
                          <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "12px" }}>
                            <span className="text-muted">Students: <strong>{course.enrolled}</strong></span>
                            <span className="text-muted">Avg Completion: <strong>{course.completion}%</strong></span>
                          </div>
                          
                          <div className="progress mb-3" style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.08)" }}>
                            <div className="progress-bar bg-cyan" style={{ width: `${course.completion}%` }}></div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <span className={`badge ${course.status === "Published" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "9.5px" }}>
                              {course.status}
                            </span>
                            <div className="d-flex gap-1.5">
                              <button onClick={() => toggleCourseStatus(course.id)} className="btn btn-sm btn-outline-warning border-0 py-1" title={course.status === "Published" ? "Archive Course" : "Publish Course"}>
                                {course.status === "Published" ? "Archive" : "Publish"}
                              </button>
                              <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-sm btn-outline-danger border-0 py-1" title="Delete Course">
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* -------------------------------------------------------------
          DYNAMICS FLOATING MODALS OVERLAYS (STATE-BASED REACT PORTALS)
         ------------------------------------------------------------- */}
      
      {/* 1. Modal: Add User */}
      {showAddUserModal && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050
        }}>
          <div className="glass-panel p-4 w-100" style={{ maxWidth: "450px", background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.98)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Register New User Account</h5>
              <button className="btn p-0 border-0" onClick={() => setShowAddUserModal(false)}><FiX size={20} className="text-muted" /></button>
            </div>
            
            <form onSubmit={handleAddUser} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-muted small">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. M. Teja Prasanna"
                  className="form-control border-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                  required
                />
              </div>

              <div>
                <label className="form-label text-muted small">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@jntugv.edu.in"
                  className="form-control border-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label text-muted small">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="form-select border-0 text-white"
                    style={{ backgroundColor: "rgba(20,27,47,0.6)" }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Academic Year</label>
                  <select 
                    value={newUser.year}
                    onChange={(e) => setNewUser({ ...newUser, year: e.target.value })}
                    className="form-select border-0 text-white"
                    style={{ backgroundColor: "rgba(20,27,47,0.6)" }}
                    disabled={newUser.role !== "student"}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="N/A">N/A (Faculty)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-muted small">Department / Specialization</label>
                <input 
                  type="text" 
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="e.g. Cybersecurity"
                  className="form-control border-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-premium-indigo py-2 fw-bold mt-2">
                Register User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Create Course */}
      {showAddCourseModal && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050
        }}>
          <div className="glass-panel p-4 w-100" style={{ maxWidth: "480px", background: isDarkMode ? "rgba(20,27,47,0.95)" : "rgba(255,255,255,0.98)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Create Academic Course</h5>
              <button className="btn p-0 border-0" onClick={() => setShowAddCourseModal(false)}><FiX size={20} className="text-muted" /></button>
            </div>
            
            <form onSubmit={handleAddCourse} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-muted small">Course Title</label>
                <input 
                  type="text" 
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Internet of Things (IoT)"
                  className="form-control border-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label text-muted small">Category Stream</label>
                  <select 
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="form-select border-0 text-white"
                    style={{ backgroundColor: "rgba(20,27,47,0.6)" }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Status</label>
                  <select 
                    value={newCourse.status}
                    onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
                    className="form-select border-0 text-white"
                    style={{ backgroundColor: "rgba(20,27,47,0.6)" }}
                  >
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label text-muted small">Modules Count</label>
                  <input 
                    type="number" 
                    value={newCourse.modules}
                    onChange={(e) => setNewCourse({ ...newCourse, modules: Number(e.target.value) })}
                    className="form-control border-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                    min="1"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Lessons Count</label>
                  <input 
                    type="number" 
                    value={newCourse.lessons}
                    onChange={(e) => setNewCourse({ ...newCourse, lessons: Number(e.target.value) })}
                    className="form-control border-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-muted small">Thumbnail URL (Optional)</label>
                <input 
                  type="text" 
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-control border-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isDarkMode ? "#fff" : "#000" }}
                />
              </div>

              <button type="submit" className="btn btn-premium-indigo py-2 fw-bold mt-2">
                Launch Course
              </button>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}

export default AdminDashboard;