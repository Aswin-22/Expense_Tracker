import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <div className="form-card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
            />
          </div>
          {msg && <p className="form-error">{msg}</p>}
          <button type="submit" className="btn btn-primary">
            Create account
          </button>
        </form>
        <div className="form-footer">
          Already have an account? <Link to="/user/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;