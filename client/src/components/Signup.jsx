import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/user/signup",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setMsg(response.data.message);
      navigate("/user/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
