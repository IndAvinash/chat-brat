import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { verifyToken } from "./services/api";

// Create a separate component that uses useNavigate
function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        const isValid = await verifyToken(token);
        if (!isValid) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!authChecked) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<><Header onLogout={handleLogout} /><Login /></>} />
      <Route path="/login" element={<><Header onLogout={handleLogout} /><Login /></>} />
      <Route path="/signup" element={<><Header onLogout={handleLogout} /><SignUp /></>} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Header onLogout={handleLogout} /><Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
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