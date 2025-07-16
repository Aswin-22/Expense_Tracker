import { useState } from "react";
import { login } from "../redux/authSlice";
import { fetchAndSetTransactions } from "../redux/transactionSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      await dispatch(fetchAndSetTransactions()).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p style={{ color: "red" }}>{error.message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
