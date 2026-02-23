import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";


function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <AuthPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;