import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import StudentDashboard from './pages/StudentDashboard';
import OutpassRequestForm from './pages/OutpassRequestForm';
import OutpassStatus from './pages/OutpassStatus';
import StudentProfile from './pages/StudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
import AdminRequestDetail from './pages/AdminRequestDetail';
import AdminAnalytics from './pages/AdminAnalytics';
import AuditLogs from './pages/AuditLogs';
import AdminProfile from './pages/AdminProfile';
import ParentOTPVerify from './pages/ParentOTPVerify';
import ParentApproval from './pages/ParentApproval';
import NotFound from './pages/NotFound';
import ParentVerifyPage from "./pages/ParentVerifyPage";
import AdminParents from './pages/AdminParents';



const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#C41E3A]/20 border-t-[#C41E3A] rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/student/login'} replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"               element={<LandingPage />} />
    <Route path="/student/login"  element={<StudentLogin />} />
    <Route path="/student/signup" element={<StudentSignup />} />
    <Route path="/admin/login"    element={<AdminLogin />} />
    <Route path="/admin/signup"   element={<AdminSignup />} />

    {/* Student Routes */}
    <Route path="/student/dashboard"  element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
    <Route path="/student/request"    element={<ProtectedRoute requiredRole="student"><OutpassRequestForm /></ProtectedRoute>} />
    <Route path="/student/status"     element={<ProtectedRoute requiredRole="student"><OutpassStatus /></ProtectedRoute>} />
    {/* ✅ THIS WAS THE MISSING ROUTE — caused 404 on clicking any request */}
    <Route path="/student/status/:id" element={<ProtectedRoute requiredRole="student"><OutpassStatus /></ProtectedRoute>} />
    <Route path="/student/profile"    element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />

    {/* Admin Routes */}
    <Route path="/admin/dashboard"    element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/requests"     element={<ProtectedRoute requiredRole="admin"><AdminRequests /></ProtectedRoute>} />
    <Route path="/admin/requests/:id" element={<ProtectedRoute requiredRole="admin"><AdminRequestDetail /></ProtectedRoute>} />
    <Route path="/admin/analytics"    element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
    <Route path="/admin/audit-logs"   element={<ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>} />
    <Route path="/admin/profile"      element={<ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>} />
    <Route path="/admin/parents"      element={<ProtectedRoute requiredRole="admin"><AdminParents /></ProtectedRoute>} />
    {/* Parent Routes — public, no auth needed */}
    <Route path="/parent/verify"  element={<ParentOTPVerify />} />
    <Route path="/parent/approve" element={<ParentApproval />} />
    <Route path="/verify/:id" element={<ParentVerifyPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;