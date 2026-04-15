import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { verifyToken } from "./services/api";
import './App.css';
function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);


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

 

  if (!authChecked) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute>
            <Header  /><Chat />
          </ProtectedRoute>} />
      <Route path="/login" element={<><Header  /><Login /></>} />
      <Route path="/signup" element={<><Header  /><SignUp /></>} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Header  /><Chat />
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