import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { seedData } from '@/services/mockData';
import LandingPage from '@/pages/LandingPage';
import UserApp from '@/pages/UserApp';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLogin from '@/pages/AdminLogin';

function App() {
  const { isAuthenticated, isAdminAuthenticated } = useStore();

  useEffect(() => {
    seedData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F7F9F4] dark:bg-[#0A0A0F]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app/*"
          element={
            isAuthenticated ? (
              <UserApp />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/login"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/*"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
