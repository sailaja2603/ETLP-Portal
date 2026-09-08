import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiCpu, FiActivity, FiDatabase, FiCloud, FiShield, 
  FiLayers, FiWifi, FiGlobe, FiSmartphone, FiCodesandbox, 
  FiMousePointer, FiArrowRight, FiCheckCircle, FiUsers, FiAward,
  FiSearch
} from "react-icons/fi";
import API from "../services/api";

const categories = [
  { 
    name: "Artificial Intelligence", 
    icon: <FiCpu />, 
    desc: "Heuristic Graphs, Search Trees, Agent systems",
    gradient: "linear-gradient(135deg, #f59e0b, #ec4899)",
    color: "#f59e0b",
    topics: ["Heuristic Search", "Search Trees", "Agent Architecture", "Knowledge Graphs", "Game Theory"],
    difficulty: "Advanced",
    popularity: "98%",
    searchQuery: "AI"
  },
  { 
    name: "Machine Learning", 
    icon: <FiActivity />, 
    desc: "Supervised Models, Deep Networks, MLOps",
    gradient: "linear-gradient(135deg, #6366f1, #06b6d4)",
    color: "#6366f1",
    topics: ["Supervised Learning", "Neural Networks", "Deep Learning", "MLOps Pipeline", "Support Vector Machines"],
    difficulty: "Intermediate",
    popularity: "95%",
    searchQuery: "AI"
  },
  { 
    name: "Data Science", 
    icon: <FiDatabase />, 
    desc: "Exploratory Analyses, Wrangling, Pandas Arrays",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    color: "#10b981",
    topics: ["Exploratory Analysis", "Pandas DataFrames", "Data Wrangling", "Statistical Modeling", "Data Visualization"],
    difficulty: "Intermediate",
    popularity: "92%",
    searchQuery: "Data"
  },
  { 
    name: "Cloud Computing", 
    icon: <FiCloud />, 
    desc: "Virtualization Layers, IAM Policies, AWS/GCP",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#3b82f6",
    topics: ["Virtualization", "IAM Access Management", "Cloud Architectures", "Serverless Functions", "AWS/GCP Services"],
    difficulty: "Beginner",
    popularity: "90%",
    searchQuery: "Cloud"
  },
  { 
    name: "Cyber Security", 
    icon: <FiShield />, 
    desc: "Penetration Matrices, OWASP Top 10, Protocols",
    gradient: "linear-gradient(135deg, #ef4444, #f43f5e)",
    color: "#ef4444",
    topics: ["Penetration Testing", "OWASP Vulnerabilities", "Cryptographic Protocols", "Network Security", "Threat Modeling"],
    difficulty: "Advanced",
    popularity: "94%",
    searchQuery: "Cybersecurity"
  },
  { 
    name: "Blockchain", 
    icon: <FiLayers />, 
    desc: "Consensus Protocols, Smart Contracts, Cryptography",
    gradient: "linear-gradient(135deg, #8b5cf6, #d946ef)",
    color: "#8b5cf6",
    topics: ["Consensus Algorithms", "Smart Contract Audits", "Ethereum Virtual Machine", "Cryptography Principles", "Solidity Scripting"],
    difficulty: "Advanced",
    popularity: "88%",
    searchQuery: "Web3"
  },
  { 
    name: "Internet of Things", 
    icon: <FiWifi />, 
    desc: "Sensor Messaging, MQTT/CoAP, Firmware Logic",
    gradient: "linear-gradient(135deg, #f97316, #f59e0b)",
    color: "#f97316",
    topics: ["Sensor Networks", "MQTT/CoAP Messaging", "Firmware Scripting", "Embedded Systems", "Hardware Interfaces"],
    difficulty: "Intermediate",
    popularity: "85%",
    searchQuery: "IoT"
  },
  { 
    name: "Web Development", 
    icon: <FiGlobe />, 
    desc: "Client-Server dynamic DOM, State lifecycles",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    color: "#06b6d4",
    topics: ["Dynamic DOM", "Component Lifecycles", "State Management", "RESTful Interfaces", "Modern CSS Layouts"],
    difficulty: "Beginner",
    popularity: "96%",
    searchQuery: "Web"
  },
  { 
    name: "Mobile App Development", 
    icon: <FiSmartphone />, 
    desc: "Cross-Platform Native, Hybrid lifecycles",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    color: "#ec4899",
    topics: ["Cross-Platform Architectures", "Native Rendering Engine", "Hybrid Application Lifecycle", "Mobile Hardware API", "Push Notifications"],
    difficulty: "Intermediate",
    popularity: "89%",
    searchQuery: "Mobile"
  },
  { 
    name: "DevOps", 
    icon: <FiCodesandbox />, 
    desc: "CI/CD Automation, Container Orchestrations, Git",
    gradient: "linear-gradient(135deg, #14b8a6, #10b981)",
    color: "#14b8a6",
    topics: ["CI/CD Pipeline", "Container Orchestration", "Version Control", "Docker Containers", "Kubernetes Clustering"],
    difficulty: "Intermediate",
    popularity: "93%",
    searchQuery: "DevOps"
  },
  { 
    name: "UI/UX Design", 
    icon: <FiMousePointer />, 
    desc: "Information Architecture, User Journey maps",
    gradient: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    color: "#8b5cf6",
    topics: ["Information Architecture", "User Journey Flow", "Wireframe Prototyping", "Design System tokens", "Usability Testing"],
    difficulty: "Beginner",
    popularity: "87%",
    searchQuery: "UI/UX"
  }
];

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [categoryQuery, setCategoryQuery] = useState("");


  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const res = await API.get("/courses");
        if (res.data.success) {
          setCourses(res.data.courses.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingCourses();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate contact form submission
    setContactSent(true);
    setContactData({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Master Emerging Technologies
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Unlocking future-ready computer science engineering skills at JNTU-GV. Learn through videos, notes, interactive quizzes, and AI-powered learning assistance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/courses" className="btn btn-premium-indigo btn-lg me-3">
              Browse Catalog <FiArrowRight className="ms-2" />
            </Link>
            <Link to="/register" className="btn btn-premium-outline btn-lg">
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Technologies */}
      <section className="py-5 tech-explorer-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white text-gradient-indigo-cyan">Featured Technologies</h2>
            <p className="text-secondary">Explore specialized domains of the target syllabus taxonomy and jump straight into course content</p>
          </div>
          
          <div className="tech-explorer-layout">
            {/* Left Explorer List */}
            <div className="tech-explorer-sidebar">
              <div className="tech-search-wrapper mb-3">
                <FiSearch className="tech-search-icon" />
                <input 
                  type="text" 
                  className="form-control tech-search-input" 
                  placeholder="Filter technologies..."
                  value={categoryQuery}
                  onChange={e => setCategoryQuery(e.target.value)}
                />
              </div>
              <div className="tech-explorer-list">
                {categories.filter(cat => 
                  cat.name.toLowerCase().includes(categoryQuery.toLowerCase()) || 
                  cat.desc.toLowerCase().includes(categoryQuery.toLowerCase())
                ).map((cat, idx) => {
                  const isActive = activeCategory.name === cat.name;
                  return (
                    <button
                      key={idx}
                      className={`tech-explorer-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                      style={{ 
                        '--accent-color': cat.color,
                        '--accent-gradient': cat.gradient
                      }}
                    >
                      <span className="tech-item-icon" style={{ color: cat.color }}>{cat.icon}</span>
                      <div className="text-start flex-grow-1">
                        <div className="tech-item-name text-white fw-bold">{cat.name}</div>
                        <div className="tech-item-desc text-secondary small">{cat.desc}</div>
                      </div>
                      <div className="tech-item-indicator" style={{ background: cat.gradient }} />
                    </button>
                  );
                })}
                {categories.filter(cat => 
                  cat.name.toLowerCase().includes(categoryQuery.toLowerCase()) || 
                  cat.desc.toLowerCase().includes(categoryQuery.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-4 text-muted">
                    No matching technologies found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Spotlight Panel */}
            <div className="tech-spotlight-wrapper">
              <motion.div 
                key={activeCategory.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="tech-spotlight-card h-100"
                style={{ 
                  '--accent-color': activeCategory.color,
                  '--accent-gradient': activeCategory.gradient 
                }}
              >
                <div className="tech-spotlight-header">
                  <div className="tech-spotlight-glow" style={{ background: activeCategory.gradient }} />
                  <div className="tech-spotlight-icon-wrap" style={{ background: activeCategory.gradient }}>
                    {activeCategory.icon}
                  </div>
                  <div className="flex-grow-1">
                    <span className={`badge-difficulty difficulty-${activeCategory.difficulty.toLowerCase()}`}>
                      {activeCategory.difficulty}
                    </span>
                    <h3 className="text-white fw-bold mt-1 mb-0">{activeCategory.name}</h3>
                  </div>
                </div>

                <div className="tech-spotlight-body mt-4">
                  <p className="text-secondary lead fs-6">{activeCategory.desc}</p>
                  
                  <div className="mt-4">
                    <h6 className="text-white fw-semibold mb-2">Key Curriculum Modules</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {activeCategory.topics.map((topic, i) => (
                        <span key={i} className="tech-topic-pill">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="row g-3 mt-4 pt-3 border-top border-secondary-subtle">
                    <div className="col-6">
                      <div className="small text-muted">Syllabus Relevance</div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <div className="progress flex-grow-1 bg-dark" style={{ height: 6 }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: activeCategory.popularity, 
                              background: activeCategory.gradient 
                            }} 
                          />
                        </div>
                        <span className="text-white fw-bold small">{activeCategory.popularity}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-muted">Portal Modules Status</div>
                      <div className="text-cyan fw-bold mt-1 small" style={{ color: activeCategory.color }}>
                        Interactive Quizzes Ready
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tech-spotlight-footer mt-5">
                  <Link 
                    to={`/courses?filter=${activeCategory.searchQuery}`} 
                    className="btn btn-spotlight-cta w-100 py-3"
                    style={{ background: activeCategory.gradient }}
                  >
                    Explore {activeCategory.name} Courses <FiArrowRight className="ms-2" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trending Courses */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="display-6 fw-bold text-white">Trending Courses</h2>
              <p className="text-secondary mb-0">Learn from leading faculty and expert-vetted curricula</p>
            </div>
            <Link to="/courses" className="btn btn-premium-outline">View All</Link>
          </div>
          
          {loading ? (
            <div className="text-center text-muted">Loading trending courses...</div>
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course.id} className="col-md-4">
                  <div className="course-card-custom">
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"} 
                      alt={course.title} 
                      className="course-card-img" 
                    />
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      <div className="mb-2">
                        <span className="badge-category">{course.category}</span>
                      </div>
                      <h4 className="fw-bold my-2" style={{ color: "#0f172a" }}>{course.title}</h4>
                      <p className="small flex-grow-1" style={{ color: "#0369a1" }}>{course.description ? course.description.substring(0, 100) + "..." : "No description available."}</p>
                      <Link to={`/course/${course.id}`} className="btn btn-premium-cyan w-100 mt-3">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="py-5 bg-secondary" style={{ background: "rgba(19, 26, 44, 0.4)" }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="dashboard-card py-4">
                <FiUsers className="text-cyan mb-2" size={32} style={{ color: "#06b6d4" }} />
                <h2 className="metric-number text-white">2,500+</h2>
                <div className="metric-label">Active Students</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card py-4">
                <FiCheckCircle className="text-indigo mb-2" size={32} style={{ color: "#6366f1" }} />
                <h2 className="metric-number text-white">45+</h2>
                <div className="metric-label">Verified Courses</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card py-4">
                <FiCpu className="text-pink mb-2" size={32} style={{ color: "#ec4899" }} />
                <h2 className="metric-number text-white">100%</h2>
                <div className="metric-label">Cloud Hands-on</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card py-4">
                <FiAward className="text-gold mb-2" size={32} style={{ color: "#f59e0b" }} />
                <h2 className="metric-number text-white">1,200+</h2>
                <div className="metric-label">Certificates Issued</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-white">Student Testimonials</h2>
            <p className="text-secondary">Hear what JNTU-GV students say about the portal</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="dashboard-card h-100">
                <p className="text-secondary italic">"The AI chatbot assistant is like having a private tutor open in the sidebar while watching lectures. The progress calculation feels extremely satisfying!"</p>
                <h6 className="text-white fw-bold m-0 mt-3">— Shabira, CSE Student</h6>
              </div>
            </div>
            <div className="col-md-4">
              <div className="dashboard-card h-100">
                <p className="text-secondary italic">"Creating modules and multiple-choice quizzes is incredibly straightforward. It has dramatically eased how I manage my recorded lectures."</p>
                <h6 className="text-white fw-bold m-0 mt-3">— Prof. Sailaja S, Faculty of CSE</h6>
              </div>
            </div>
            <div className="col-md-4">
              <div className="dashboard-card h-100">
                <p className="text-secondary italic">"The DevOps and Cloud Computing course tracks are aligned with industry requirements. Downloading my verified certificate was seamless."</p>
                <h6 className="text-white fw-bold m-0 mt-3">— Ramesh K, Alumni</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Section */}
      <section className="py-5 bg-secondary" style={{ background: "rgba(19, 26, 44, 0.4)" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="text-center mb-4">
            <h2 className="display-6 fw-bold text-white">Get In Touch</h2>
            <p className="text-secondary">Have questions? Send us a message and we'll reply shortly.</p>
          </div>
          <form onSubmit={handleContactSubmit} className="dashboard-card">
            {contactSent && (
              <div className="alert alert-success bg-success text-white border-0 mb-4">
                Thank you! Your message has been sent successfully. We will email you back.
              </div>
            )}
            <div className="mb-3">
              <label className="form-label form-label-custom">Full Name</label>
              <input 
                type="text" 
                className="form-control form-control-custom"
                value={contactData.name}
                onChange={e => setContactData({ ...contactData, name: e.target.value })}
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label form-label-custom">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-custom"
                value={contactData.email}
                onChange={e => setContactData({ ...contactData, email: e.target.value })}
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label form-label-custom">Message</label>
              <textarea 
                className="form-control form-control-custom" 
                rows="4"
                value={contactData.message}
                onChange={e => setContactData({ ...contactData, message: e.target.value })}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-premium-indigo w-100">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;