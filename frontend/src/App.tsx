import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StatusPage from './components/StatusPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BalanceProvider } from './contexts/BalanceContext';

function AppContent() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginPage />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <BalanceProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BalanceProvider>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
