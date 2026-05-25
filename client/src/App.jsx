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
import ProfilePage from './pages/Student/ProfilePage';

import FacultyLayout from './layouts/FacultyLayout';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import FacultyMentorshipPage from './pages/Faculty/FacultyMentorshipPage';
import FacultyNoticesPage from './pages/Faculty/FacultyNoticesPage';
import FacultyGrievancePage from './pages/Faculty/FacultyGrievancePage';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagementPage from './pages/Admin/UserManagementPage';
import AdminEventsPage from './pages/Admin/AdminEventsPage';
import GrievancePipelinePage from './pages/Admin/GrievancePipelinePage';

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
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="/faculty" element={
            <ProtectedRoute roles={['faculty', 'admin']}>
              <FacultyLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="mentorship" element={<FacultyMentorshipPage />} />
            <Route path="grievances" element={<FacultyGrievancePage />} />
            <Route path="notices" element={<FacultyNoticesPage />} />
          </Route>
          
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="grievance-pipeline" element={<GrievancePipelinePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
