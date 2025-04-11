import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
