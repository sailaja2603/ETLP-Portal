import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaAward, FaBookOpen, FaUser } from "react-icons/fa";
import API from "../services/api";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/dashboard/leaderboard");
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mt-5 pt-4 mb-5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <div className="d-inline-flex bg-warning bg-opacity-10 p-3 rounded-circle mb-3">
          <FaTrophy className="text-warning fs-1" />
        </div>
        <h1 className="fw-bold text-white mb-2">Student Leaderboard</h1>
        <p className="text-muted fs-5">Celebrating our top emerging technology learners</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger bg-danger text-white border-0">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center text-muted py-5">No students ranked yet.</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="glass-panel p-4 rounded-4 shadow-lg">
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                  <thead>
                    <tr className="border-secondary text-secondary">
                      <th scope="col" className="ps-4">Rank</th>
                      <th scope="col">Student</th>
                      <th scope="col" className="text-center">Enrolled Courses</th>
                      <th scope="col" className="text-center">Completed Courses</th>
                      <th scope="col" className="text-center pe-4">Avg Quiz Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((student, index) => {
                      const rank = index + 1;
                      const isTopThree = rank <= 3;
                      const badgeColor = rank === 1 ? "text-warning" : rank === 2 ? "text-light" : "text-danger";

                      return (
                        <tr key={student.id} className="border-secondary hover-lift">
                          <td className="ps-4 fw-bold">
                            {isTopThree ? (
                              <div className="d-flex align-items-center gap-2">
                                <FaMedal className={`${badgeColor} fs-4`} />
                                <span>{rank}</span>
                              </div>
                            ) : (
                              <span className="ps-2 text-muted">{rank}</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {student.profile_image ? (
                                <img 
                                  src={student.profile_image} 
                                  alt={student.name} 
                                  className="rounded-circle object-fit-cover border border-secondary" 
                                  width="40" 
                                  height="40" 
                                />
                              ) : (
                                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center border border-secondary" style={{ width: 40, height: 40 }}>
                                  <FaUser className="text-white bg-opacity-70" />
                                </div>
                              )}
                              <div>
                                <h6 className="mb-0 fw-bold text-white">{student.name}</h6>
                                <small className="text-muted">{student.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-semibold text-cyan">
                            <FaBookOpen className="me-1 small" /> {student.enrolled_courses}
                          </td>
                          <td className="text-center fw-semibold text-success">
                            <FaAward className="me-1 small" /> {student.completed_courses}
                          </td>
                          <td className="text-center pe-4">
                            <div className="d-inline-block px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold">
                              {student.avg_quiz_score}%
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
