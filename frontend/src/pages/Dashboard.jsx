import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlayCircle, FaCheckCircle, FaAward, FaClock, FaBookOpen } from "react-icons/fa";
import AdminDashboard from "./AdminDashboard";
import API from "../services/api";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resultsRes] = await Promise.all([
          API.get("/dashboard"),
          API.get("/results/my-results")
        ]);
        
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (resultsRes.data.success) {
          const sorted = resultsRes.data.results.sort((a, b) => b.id - a.id).slice(0, 3);
          setActivities(sorted);
        }
      } catch (err) {
        console.error("Dashboard load error", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "student") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role === "admin" || user?.role === "faculty") {
    return <AdminDashboard />;
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4 mb-5">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-end mb-4"
      >
        <div>
          <h1 className="fw-bold mb-1">Welcome back, {user?.name || "Student"}! 👋</h1>
          <p className="text-muted fs-5">Ready to continue your learning journey?</p>
        </div>
        <Link to="/courses" className="btn btn-premium-indigo px-4 py-2 rounded-pill shadow-sm">
          Browse New Courses
        </Link>
      </motion.div>

      {/* Stats Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-4 rounded-4 position-relative overflow-hidden h-100"
          >
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <FaBookOpen className="text-primary fs-3" />
              </div>
              <div>
                <h2 className="fw-bold mb-0">{stats?.enrolledCount || 0}</h2>
                <p className="text-muted mb-0 fw-medium">Active Courses</p>
              </div>
            </div>
            <div className="position-absolute" style={{ right: '-20px', bottom: '-20px', opacity: 0.05 }}>
              <FaBookOpen size={120} />
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-4 rounded-4 position-relative overflow-hidden h-100"
          >
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                <FaCheckCircle className="text-success fs-3" />
              </div>
              <div>
                <h2 className="fw-bold mb-0">{stats?.completedCount || 0}</h2>
                <p className="text-muted mb-0 fw-medium">Completed Courses</p>
              </div>
            </div>
            <div className="position-absolute" style={{ right: '-20px', bottom: '-20px', opacity: 0.05 }}>
              <FaCheckCircle size={120} />
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-4 rounded-4 position-relative overflow-hidden h-100"
          >
            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                <FaAward className="text-warning fs-3" />
              </div>
              <div>
                <h2 className="fw-bold mb-0">{stats?.certificatesCount || 0}</h2>
                <p className="text-muted mb-0 fw-medium">Certificates Earned</p>
              </div>
            </div>
            <div className="position-absolute" style={{ right: '-20px', bottom: '-20px', opacity: 0.05 }}>
              <FaAward size={120} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-5">
        
        {/* Left Column: Continue Learning */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Continue Learning</h3>
            <Link to="/progress" className="text-decoration-none fw-semibold">View All Progress →</Link>
          </div>

          <div className="d-flex flex-column gap-4">
            {!stats?.recentProgress || stats.recentProgress.length === 0 ? (
              <div className="text-muted text-center py-4 glass-panel rounded-4">
                You are not enrolled in any courses yet. <Link to="/courses" className="text-cyan text-decoration-none">Browse courses</Link> to start learning!
              </div>
            ) : (
              stats.recentProgress.map((course, index) => (
                <motion.div 
                  key={course.course_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel enrolled-course-card rounded-4 p-3 d-flex align-items-center gap-4 position-relative hover-lift"
                >
                  <div className="position-relative" style={{ width: '180px', height: '120px' }}>
                    <img src={course.thumbnail || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb"} alt={course.title} className="w-100 h-100 object-fit-cover rounded-3 shadow-sm" />
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <FaPlayCircle className="text-white fs-1 drop-shadow" />
                    </div>
                  </div>

                  <div className="flex-grow-1 py-2">
                    <h5 className="fw-bold mb-1">{course.title}</h5>
                    <p className="text-muted small mb-3">Category: {course.category}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="fw-semibold text-primary">{Math.round(course.completion_percentage)}% Completed</small>
                      <small className="text-muted"><FaClock className="me-1"/> Last active: {new Date(course.updated_at).toLocaleDateString()}</small>
                    </div>
                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                      <div 
                        className="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: `${course.completion_percentage}%` }} 
                        aria-valuenow={course.completion_percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pe-3">
                    <Link to={`/course/${course.course_id}`} className="btn btn-outline-primary rounded-circle p-3 shadow-sm">
                      <FaPlayCircle size={24} />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recommendations & Activity */}
        <div className="col-lg-4">
          
          <div className="glass-panel p-4 rounded-4 mb-4">
            <h4 className="fw-bold mb-4">Quiz Performance</h4>
            <div className="text-center mb-3">
              <div className="position-relative d-inline-block">
                <svg width="120" height="120" viewBox="0 0 120 120" className="circular-progress">
                  <circle className="bg" cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" strokeWidth="8" />
                  <circle 
                    className="progress-circle" 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="none" 
                    stroke="#4F46E5" 
                    strokeWidth="8" 
                    strokeDasharray="339.292" 
                    strokeDashoffset={339.292 * (1 - (stats?.avgScore || 0) / 100)} 
                    strokeLinecap="round" 
                    transform="rotate(-90 60 60)" 
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h3 className="fw-bold mb-0">{stats?.avgScore || 0}%</h3>
                </div>
              </div>
            </div>
            <p className="text-center text-muted mb-0">Average quiz score across all attempts.</p>
          </div>

          <div className="glass-panel p-4 rounded-4">
            <h4 className="fw-bold mb-4">Recent Activity</h4>
            <div className="position-relative" style={{ borderLeft: '2px solid #38bdf8', marginLeft: '10px' }}>
              
              {activities.length === 0 ? (
                <div className="text-muted ps-3 py-2 small">No recent quiz attempts yet.</div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="position-relative mb-4" style={{ paddingLeft: '25px' }}>
                    <div className="position-absolute bg-primary rounded-circle" style={{ width: '12px', height: '12px', left: '-7px', top: '5px' }}></div>
                    <p className="fw-semibold mb-1">Quiz: {act.title}</p>
                    <small className="text-muted">
                      Score: {act.score}/{act.total_questions} ({Math.round((act.score / act.total_questions) * 100)}%) • {new Date(act.created_at).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;