import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Axios instance
import "./Login.css";

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};

return (
  <div className="register-container">
    <h2>Register</h2>
    {error && <p className="error">{error}</p>}
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  </div>
);

export default Login;

