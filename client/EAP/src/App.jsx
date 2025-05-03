import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // You'll create this later
import ProtectedRoute from './components/ProtectedRoute'; // You'll create this later

export default function App() {
  return (
  
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    
  );
}