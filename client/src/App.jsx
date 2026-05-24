import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import AuthPage from './pages/Auth/AuthPage';

import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/Student/StudentDashboard';
import GrievancePage from './pages/Student/GrievancePage';
import EventsPage from './pages/Student/EventsPage';
import MentorshipPage from './pages/Student/MentorshipPage';
import LostFoundPage from './pages/Student/LostFoundPage';

import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="grievances" element={<GrievancePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="mentorship" element={<MentorshipPage />} />
            <Route path="lost-found" element={<LostFoundPage />} />
            <Route path="profile" element={<div className="p-8 text-white text-3xl font-bold font-sora">Student Profile</div>} />
          </Route>
          
          <Route path="/faculty/dashboard" element={
            <ProtectedRoute roles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
