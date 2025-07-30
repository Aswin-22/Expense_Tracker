import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../redux/authSlice";

function Signup() {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await dispatch(signup(formData)).unwrap();
      navigate("/user/login");
    } catch (error) {
      setMsg(error.message || "Signup failed. Please try again.");
      console.error("Signup error:", error);
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
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
