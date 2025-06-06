import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { IdeasProvider } from './contexts/IdeasContext';
import { AIProvider } from './contexts/AIContext';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MyIdeas } from './pages/MyIdeas';
import { NewIdea } from './pages/NewIdea';
import { Ranking } from './pages/Ranking';
import { Implemented } from './pages/Implemented';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="my-ideas" element={<MyIdeas />} />
        <Route path="new-idea" element={<NewIdea />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="implemented" element={<Implemented />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <IdeasProvider>
            <AIProvider>
              <AppRoutes />
            </AIProvider>
          </IdeasProvider>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;