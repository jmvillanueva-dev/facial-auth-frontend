import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./components/pages/Home/Home.jsx";
import Auth from "./components/pages/Auth/Auth.jsx";
import Dashboard from "./components/pages/Dashboard/Dashboard.jsx";
import FacialEnroll from "./components/pages/test/FacialEnroll";
import FacialLogin from "./components/pages/test/FacialLogin";
import Register from "./components/pages/test/Register";

import "./App.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enroll" element={<FacialEnroll />} />
          <Route path="/login" element={<FacialLogin />} />
          <Route path="/register" element={<Register />} />
          {/* Ruta por defecto para manejar rutas no encontradas */}
          <Route path="*" element={<Home />} />
        </Routes>

        {/* Protected routes */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

      </>
    );
}

export default App;
