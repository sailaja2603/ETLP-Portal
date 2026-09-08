import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import Progress from "./pages/Progress";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Certificates from "./pages/Certificates";
import Notifications from "./pages/Notifications";
import AITutorWidget from "./components/AITutorWidget";
import * as MissingPages from "./pages/MissingPages";
import Leaderboard from "./pages/Leaderboard";
import SessionQuizPage from "./pages/SessionQuizPage";

function AppContent() {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/course/") || location.pathname.startsWith("/session-quiz/");

  return (
    <>

      {!hideChrome && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={<Courses />} />

        <Route
          path="/session-quiz/:courseId/:sessionIndex"
          element={
            <ProtectedRoute>
              <SessionQuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/quiz"
          element={<ProtectedRoute><Quiz /></ProtectedRoute>}
        />

        <Route
          path="/results"
          element={<ProtectedRoute><Results /></ProtectedRoute>}
        />

        <Route
          path="/certificates"
          element={<ProtectedRoute><Certificates /></ProtectedRoute>}
        />
        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/progress"
          element={<ProtectedRoute><Progress /></ProtectedRoute>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute><Notifications /></ProtectedRoute>}
        />

        {/* --- Missing Public Pages --- */}
        <Route path="/splash" element={<MissingPages.Splash />} />
        <Route path="/about" element={<MissingPages.About />} />
        <Route path="/contact" element={<MissingPages.Contact />} />
        <Route path="/faq" element={<MissingPages.FAQ />} />
        <Route path="/privacy" element={<MissingPages.Privacy />} />
        <Route path="/terms" element={<MissingPages.Terms />} />

        {/* --- Missing Auth Pages --- */}
        <Route path="/forgot-password" element={<MissingPages.ForgotPassword />} />
        <Route path="/reset-password" element={<MissingPages.ResetPassword />} />
        <Route path="/verify-email" element={<MissingPages.VerifyEmail />} />
        <Route path="/role-selection" element={<MissingPages.RoleSelection />} />

        {/* --- Missing Student Pages --- */}
        <Route path="/edit-profile" element={<ProtectedRoute><MissingPages.EditProfile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><MissingPages.Wishlist /></ProtectedRoute>} />
        <Route path="/continue-watching" element={<ProtectedRoute><MissingPages.ContinueWatching /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><MissingPages.Achievements /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><MissingPages.Settings /></ProtectedRoute>} />
        <Route path="/category-courses" element={<MissingPages.CategoryCourses />} />
        <Route path="/certificate-viewer" element={<MissingPages.CertificateViewer />} />

        {/* --- Missing Admin Pages (Including Former Faculty Pages) --- */}
        <Route path="/admin-login" element={<MissingPages.AdminLogin />} />
        <Route path="/admin/users" element={<AdminRoute><MissingPages.UserManagement /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><MissingPages.StudentManagement /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><MissingPages.AdminCourseManagement /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><MissingPages.CategoryManagement /></AdminRoute>} />
        <Route path="/admin/videos" element={<AdminRoute><MissingPages.AdminVideoManagement /></AdminRoute>} />
        <Route path="/admin/quizzes" element={<AdminRoute><MissingPages.AdminQuizManagement /></AdminRoute>} />
        <Route path="/admin/enrollments" element={<AdminRoute><MissingPages.EnrollmentManagement /></AdminRoute>} />
        <Route path="/admin/certificates" element={<AdminRoute><MissingPages.CertificateManagement /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><MissingPages.Reports /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><MissingPages.AnalyticsDashboard /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><MissingPages.SystemSettings /></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><MissingPages.AdminNotificationCenter /></AdminRoute>} />
        <Route path="/admin/feedback" element={<AdminRoute><MissingPages.FeedbackManagement /></AdminRoute>} />
        <Route path="/admin/create-course" element={<AdminRoute><MissingPages.CreateCourse /></AdminRoute>} />
        <Route path="/admin/edit-course" element={<AdminRoute><MissingPages.EditCourse /></AdminRoute>} />
        <Route path="/admin/create-modules" element={<AdminRoute><MissingPages.CreateModules /></AdminRoute>} />
        <Route path="/admin/manage-modules" element={<AdminRoute><MissingPages.ManageModules /></AdminRoute>} />
        <Route path="/admin/upload-video" element={<AdminRoute><MissingPages.UploadVideo /></AdminRoute>} />
        <Route path="/admin/create-quiz" element={<AdminRoute><MissingPages.CreateQuiz /></AdminRoute>} />
        <Route path="/admin/manage-quiz" element={<AdminRoute><MissingPages.ManageQuiz /></AdminRoute>} />
        <Route path="/admin/student-performance" element={<AdminRoute><MissingPages.StudentPerformance /></AdminRoute>} />
        <Route path="/admin/course-analytics" element={<AdminRoute><MissingPages.CourseAnalytics /></AdminRoute>} />

        {/* --- Additional Pages --- */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/forum" element={<MissingPages.DiscussionForum />} />
        <Route path="/feedback" element={<MissingPages.StudentFeedback />} />
        <Route path="/help" element={<MissingPages.HelpCenter />} />
        <Route path="/support" element={<MissingPages.SupportTicket />} />
        <Route path="/maintenance" element={<MissingPages.Maintenance />} />
        <Route path="/logout-success" element={<MissingPages.LogoutConfirmation />} />
        <Route path="*" element={<MissingPages.NotFound />} />
      </Routes>

      {!hideChrome && <Footer />}
      <AITutorWidget />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
