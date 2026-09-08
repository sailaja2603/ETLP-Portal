import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiAward, FiCheck, FiCheckCircle, FiAlertCircle, FiBookOpen, FiChevronDown, FiChevronUp } from "react-icons/fi";
import API from "../services/api";
import { getSessionTitle, getSessionQuizQuestions } from "../utils/quizzesData";
import { getDetailedCourseNotes } from "../utils/courseNotesData";

const getFallbackCourseTitle = (courseId = "") => {
  const slug = (courseId || "").toLowerCase();

  if (slug.includes("quantum")) return "Quantum Computing Certification Course";
  if (slug.includes("cybersecurity")) return "Cybersecurity Certification Course";
  if (slug.includes("iot")) return "Internet of Things (IoT) Workshop";
  if (slug.includes("ai")) return "AI Tools Course";

  return "Preview Course";
};

const buildFallbackCourse = (courseId, sessionIndex) => {
  const safeSession = Number(sessionIndex) || 1;
  return {
    id: courseId || "preview-course",
    title: getFallbackCourseTitle(courseId),
    description: "Local preview mode for the interactive quiz experience.",
    videos: Array.from({ length: Math.max(1, safeSession) }, (_, index) => ({
      id: `preview-session-${index + 1}`,
      name: `Preview Session ${index + 1}`
    }))
  };
};

function SessionQuizPage() {
  const { courseId, sessionIndex } = useParams();
  const navigate = useNavigate();
  const sessionNum = parseInt(sessionIndex, 10) || 1;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const showToast = (message, type = "info", ms = 3000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "info" }), ms);
  };

  let user = null;
  try {
    const userJson = localStorage.getItem("user");
    user = userJson ? JSON.parse(userJson) : null;
  } catch (err) {
    console.warn("Invalid user data in localStorage", err);
  }

  const effectiveUser = user;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/session-quiz/${courseId}/${sessionIndex}` } } });
      return;
    }

    const fallbackCourse = buildFallbackCourse(courseId, sessionIndex);

    const fetchData = async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        const apiCourse = res?.data?.course;
        const apiModules = res?.data?.modules || [];
        // Flatten all videos from all modules into a single list of lessons/sessions
        const apiVideos = apiModules.reduce((acc, m) => {
          return acc.concat((m.videos || []).map(v => ({
            ...v,
            name: v.title // Normalize to .name property used by components
          })));
        }, []);

        const resolvedCourse = apiCourse && (apiCourse.title || apiCourse.id)
          ? { 
              ...apiCourse, 
              id: apiCourse.id || courseId, 
              title: apiCourse.title || "Preview Course",
              videos: apiVideos.length > 0 ? apiVideos : (fallbackCourse.videos || [])
            }
          : fallbackCourse;
        setCourse(resolvedCourse);

        const progressKey = `course_progress_${effectiveUser.id}_${courseId}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setCompletedVideos(parsed.videos || {});
          setCompletedQuizzes(parsed.quizzes || {});

          const modulesList = resolvedCourse.videos || [];
          const matchedVideo = modulesList[sessionNum - 1];
          if (matchedVideo && parsed.quizzes[matchedVideo.id]) {
            setPassed(true);
          }
        }
      } catch (err) {
        console.warn("Falling back to preview quiz data", err);
        setCourse(fallbackCourse);
      } finally {
        setLoading(false);
      }
    };

    // If we have a user, attempt to fetch the real course from database.
    // If not, use local fallback course preview.
    if (user) {
      fetchData();
    } else {
      setCourse(fallbackCourse);
      setLoading(false);
    }
  }, [courseId, sessionNum, sessionIndex, navigate, effectiveUser.id, user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
        <p>Loading Quiz Workspace...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-premium-indigo mt-3">Back to Courses</Link>
      </div>
    );
  }

  const modulesList = course.videos || [];
  const matchedVideo = modulesList[sessionNum - 1];
  const videoId = matchedVideo ? matchedVideo.id : `session_${sessionNum}`;

  const courseTitle = course?.title || getFallbackCourseTitle(courseId);
  const questions = getSessionQuizQuestions(courseTitle, sessionNum);
  const sessionTitleStr = getSessionTitle(courseTitle, sessionNum);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let allCorrect = true;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] !== questions[i].ans) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setPassed(true);
      const newQuizzes = { ...completedQuizzes, [videoId]: true };
      const newVideos = { ...completedVideos, [videoId]: true };
      
      setCompletedQuizzes(newQuizzes);
      setCompletedVideos(newVideos);

      // Save progress to local storage
      const progressKey = `course_progress_${effectiveUser.id}_${courseId}`;
      localStorage.setItem(progressKey, JSON.stringify({ videos: newVideos, quizzes: newQuizzes }));

      // Sync progress with database
      const totalSessions = modulesList.length || 1;
      const completedCount = modulesList.filter(
        (mod) => newVideos[mod.id] && newQuizzes[mod.id]
      ).length;
      const progressPercentage = Math.round((completedCount / totalSessions) * 100);

      try {
        await API.post("/enrollments/update-progress", {
          courseId: course.id,
          progress: progressPercentage
        });
      } catch (err) {
        console.warn("Failed to sync course progress", err);
      }

      showToast("Congratulations! You passed the quiz.", "success");
    } else {
      setPassed(false);
      showToast("Some answers are incorrect. Please try again!", "error");
    }
  };

  const handleRetake = () => {
    const newQuizzes = { ...completedQuizzes, [videoId]: false };
    const newVideos = { ...completedVideos, [videoId]: false };
    
    setCompletedQuizzes(newQuizzes);
    setCompletedVideos(newVideos);
    setPassed(false);
    setAnswers({});
    setSubmitted(false);

    const progressKey = `course_progress_${effectiveUser.id}_${courseId}`;
    localStorage.setItem(progressKey, JSON.stringify({ videos: newVideos, quizzes: newQuizzes }));

    // Sync database
    const totalSessions = modulesList.length || 1;
    const completedCount = modulesList.filter(
      (mod) => newVideos[mod.id] && newQuizzes[mod.id]
    ).length;
    const progressPercentage = Math.round((completedCount / totalSessions) * 100);

    API.post("/enrollments/update-progress", {
      courseId: course.id,
      progress: progressPercentage
    }).catch(err => console.warn(err));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <Link 
          to={`/course/${courseId}`} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#bae6fd', textDecoration: 'none', marginBottom: '24px', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = '#38bdf8'}
          onMouseOut={(e) => e.target.style.color = '#bae6fd'}
        >
          <FiArrowLeft /> Back to Course details
        </Link>

        {/* Heading Panel */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#38bdf8', fontWeight: 'bold' }}>Interactive Assessment</span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 4px 0', color: '#ffffff' }}>{sessionTitleStr}</h2>
          <p style={{ fontSize: '14px', color: '#bae6fd', margin: 0 }}>Course: {course.title}</p>
        </div>

        {/* Detailed Session Notes & Reference Cheat Sheet Card */}
        {(() => {
          const sessionNotes = getDetailedCourseNotes(course.title, sessionNum);
          return (
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '32px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiBookOpen style={{ color: '#06b6d4', fontSize: '20px' }} />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>
                      Session {sessionNum} Detailed Reference Notes
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)', margin: '2px 0 0 0' }}>
                      Review essential concepts, formulas & takeaways before taking the quiz.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  style={{
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#06b6d4',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {showNotes ? <>Hide Notes <FiChevronUp /></> : <>Review Notes <FiChevronDown /></>}
                </button>
              </div>

              {showNotes && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <p style={{ fontSize: '13.5px', color: '#38bdf8', fontWeight: '600', marginBottom: '14px' }}>
                    Summary: {sessionNotes.summary}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sessionNotes.sections.map((sec, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}>
                        <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#818cf8', marginBottom: '8px' }}>
                          {sec.heading}
                        </h5>
                        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6', margin: 0 }}>
                          {sec.content}
                        </p>
                        {sec.codeSnippet && (
                          <pre style={{
                            background: '#070a12',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#a7f3d0',
                            overflowX: 'auto'
                          }}>
                            <code>{sec.codeSnippet}</code>
                          </pre>
                        )}
                        {sec.takeaways && sec.takeaways.length > 0 && (
                          <ul style={{ marginTop: '10px', marginBottom: 0, paddingLeft: '20px', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)' }}>
                            {sec.takeaways.map((t, tIdx) => (
                              <li key={tIdx} style={{ marginBottom: '4px' }}>{t}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {passed ? (
          /* Quiz Passed Card */
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            marginTop: '20px'
          }}>
            <span style={{ fontSize: '64px' }}>🏆</span>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '20px 0 8px 0', color: '#22c55e' }}>Quiz Successfully Completed!</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 32px 0' }}>
              You answered all 10 questions correctly. The session has been marked as completed!
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                Retake Quiz
              </button>
              <Link
                to={`/course/${courseId}`}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Return to Course details <FiArrowLeft style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} />
              </Link>
            </div>
          </div>
        ) : (
          /* Quiz Questions Form */
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {questions.map((qObj, qIdx) => (
                <div key={qIdx} style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#ffffff' }}>
                    {qIdx + 1}. {qObj.q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {qObj.opts.map((opt, oIdx) => {
                      const isSelected = answers[qIdx] === oIdx;
                      return (
                        <label key={oIdx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#131c31',
                          border: '1px solid',
                          borderColor: isSelected ? '#38bdf8' : '#1e293b',
                          color: isSelected ? '#38bdf8' : '#ffffff',
                          transition: 'all 0.15s ease'
                        }}>
                          <input
                            type="radio"
                            name={`q-${qIdx}`}
                            checked={isSelected}
                            onChange={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                            style={{ accentColor: 'var(--accent-indigo)' }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {submitted && !passed && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#ef4444',
                padding: '12px 16px',
                fontSize: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}>
                <FiAlertCircle /> Some answers are incorrect. Please review and try again!
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Submit Quiz (10/10 Required)
            </button>
          </form>
        )}

      </div>

      {/* Toast container */}
      {toast.visible && (
        <div style={{ position: 'fixed', right: 20, bottom: 24, zIndex: 9999 }}>
          <div style={{
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#111827',
            color: '#fff', 
            padding: '12px 16px', 
            borderRadius: 8, 
            boxShadow: '0 6px 18px rgba(2,6,23,0.2)',
            minWidth: 260
          }}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionQuizPage;
