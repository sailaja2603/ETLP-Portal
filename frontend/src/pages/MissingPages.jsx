import React from 'react';
import { FaInfoCircle, FaPhone, FaQuestionCircle, FaUserShield, FaFileContract, FaKey, FaEnvelope, FaUserTag, FaUserEdit, FaHeart, FaHistory, FaMedal, FaCogs, FaChalkboardTeacher, FaVideo, FaClipboardList, FaChartLine, FaBell, FaUsers, FaGraduationCap, FaLayerGroup, FaTrophy, FaComments, FaLifeRing, FaExclamationTriangle, FaTools, FaSignOutAlt } from 'react-icons/fa';
import GenericPage from '../components/GenericPage';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Public Pages
export const Splash = () => {
  const navigate = useNavigate();
  return (
    <GenericPage title="Welcome to ETLP" description="The Premium EdTech Platform for Emerging Technologies." icon={<FaGraduationCap />}>
      <Button className="btn-premium-indigo px-5 py-3" onClick={() => navigate('/')}>Enter Platform</Button>
    </GenericPage>
  );
};
export const About = () => <GenericPage title="About Us" description="We provide industry-ready learning in cutting edge technologies." icon={<FaInfoCircle />} />;
export const Contact = () => <GenericPage title="Contact Us" description="Reach out to our support team 24/7." icon={<FaPhone />} />;
export const FAQ = () => <GenericPage title="Frequently Asked Questions" description="Find answers to common queries about our courses and platform." icon={<FaQuestionCircle />} />;
export const Privacy = () => <GenericPage title="Privacy Policy" description="We value your privacy and protect your data securely." icon={<FaUserShield />} />;
export const Terms = () => <GenericPage title="Terms & Conditions" description="Read the rules and guidelines for using the ETLP platform." icon={<FaFileContract />} />;

// Auth Pages
export const ForgotPassword = () => <GenericPage title="Forgot Password" description="Enter your email to receive a password reset link." icon={<FaKey />} />;
export const ResetPassword = () => <GenericPage title="Reset Password" description="Enter your new password." icon={<FaKey />} />;
export const VerifyEmail = () => <GenericPage title="Verify Email" description="Check your inbox and click the verification link." icon={<FaEnvelope />} />;
export const RoleSelection = () => <GenericPage title="Choose Your Role" description="Are you a Student or Admin?" icon={<FaUserTag />} />;

// Student Pages
export const EditProfile = () => <GenericPage title="Edit Profile" description="Update your personal details and preferences." icon={<FaUserEdit />} />;
export const Wishlist = () => <GenericPage title="My Wishlist" description="Courses you have saved for later." icon={<FaHeart />} />;
export const ContinueWatching = () => <GenericPage title="Continue Watching" description="Pick up right where you left off." icon={<FaHistory />} />;
export const Achievements = () => <GenericPage title="Achievements & Badges" description="View all the badges you've earned through learning." icon={<FaMedal />} />;
export const Settings = () => <GenericPage title="Account Settings" description="Manage your notification preferences, billing, and security." icon={<FaCogs />} />;
export const CategoryCourses = () => <GenericPage title="Courses by Category" description="Browse all available courses in this specific category." icon={<FaLayerGroup />} />;
export const CertificateViewer = () => <GenericPage title="Certificate Viewer" description="View and verify the authenticity of your completion certificate." icon={<FaFileContract />} />;

// Admin Pages
export const AdminLogin = () => <GenericPage title="Admin Login" description="Secure access for system administrators only." icon={<FaKey />} />;
export const UserManagement = () => <GenericPage title="User Management" description="Manage all platform users (Students, Admins)." icon={<FaUsers />} />;
export const StudentManagement = () => <GenericPage title="Student Management" description="Detailed management of student accounts." icon={<FaGraduationCap />} />;
export const AdminCourseManagement = () => <GenericPage title="Course Directory" description="Review and approve all courses on the platform." icon={<FaClipboardList />} />;
export const CategoryManagement = () => <GenericPage title="Category Management" description="Create or edit course categories." icon={<FaLayerGroup />} />;
export const AdminVideoManagement = () => <GenericPage title="Video Asset Library" description="Platform-wide video hosting management." icon={<FaVideo />} />;
export const AdminQuizManagement = () => <GenericPage title="Quiz Overview" description="Platform-wide quiz and assessment management." icon={<FaClipboardList />} />;
export const EnrollmentManagement = () => <GenericPage title="Enrollments" description="Manage user enrollments and subscriptions." icon={<FaUsers />} />;
export const CertificateManagement = () => <GenericPage title="Certificate Records" description="Registry of all issued certificates." icon={<FaMedal />} />;
export const Reports = () => <GenericPage title="System Reports" description="Generate compliance and financial reports." icon={<FaChartLine />} />;
export const AnalyticsDashboard = () => <GenericPage title="Platform Analytics" description="High-level metrics of platform usage." icon={<FaChartLine />} />;
export const SystemSettings = () => <GenericPage title="System Settings" description="Configure global platform variables." icon={<FaCogs />} />;
export const AdminNotificationCenter = () => <GenericPage title="Notification Center" description="Send announcements to all users." icon={<FaBell />} />;
export const FeedbackManagement = () => <GenericPage title="Feedback & Support" description="Review student feedback." icon={<FaComments />} />;

// Course Authoring (Admin)
export const CreateCourse = () => <GenericPage title="Create Course" description="Design a new curriculum." icon={<FaClipboardList />} />;
export const EditCourse = () => <GenericPage title="Edit Course" description="Modify existing course content and structure." icon={<FaClipboardList />} />;
export const CreateModules = () => <GenericPage title="Create Modules" description="Add new modules to a course." icon={<FaLayerGroup />} />;
export const ManageModules = () => <GenericPage title="Manage Modules" description="Reorder or edit modules inside a course." icon={<FaLayerGroup />} />;
export const UploadVideo = () => <GenericPage title="Upload Video" description="Upload new video lessons." icon={<FaVideo />} />;
export const CreateQuiz = () => <GenericPage title="Create Quiz" description="Design a new assessment." icon={<FaClipboardList />} />;
export const ManageQuiz = () => <GenericPage title="Manage Quiz" description="Review and update existing quizzes." icon={<FaClipboardList />} />;
export const StudentPerformance = () => <GenericPage title="Student Performance" description="Track how students are doing." icon={<FaChartLine />} />;
export const CourseAnalytics = () => <GenericPage title="Course Analytics" description="View deep insights on engagement and completion rates." icon={<FaChartLine />} />;

// Additional Pages
export const Leaderboard = () => <GenericPage title="Global Leaderboard" description="See the top learners of the month!" icon={<FaTrophy />} />;
export const DiscussionForum = () => <GenericPage title="Discussion Forum" description="Engage with peers and instructors." icon={<FaComments />} />;
export const StudentFeedback = () => <GenericPage title="Submit Feedback" description="Tell us how we can improve your learning experience." icon={<FaComments />} />;
export const HelpCenter = () => <GenericPage title="Help Center" description="Search our knowledge base for answers." icon={<FaLifeRing />} />;
export const SupportTicket = () => <GenericPage title="Support Ticket" description="Create a ticket for technical assistance." icon={<FaLifeRing />} />;
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <GenericPage title="404 - Page Not Found" description="The page you are looking for does not exist." icon={<FaExclamationTriangle />}>
      <Button className="btn-premium-indigo" onClick={() => navigate('/')}>Return Home</Button>
    </GenericPage>
  );
};
export const Maintenance = () => <GenericPage title="Maintenance Mode" description="We are currently upgrading our systems. Please check back later." icon={<FaTools />} />;
export const LogoutConfirmation = () => <GenericPage title="Logged Out Successfully" description="Thank you for using ETLP. See you next time!" icon={<FaSignOutAlt />} />;
