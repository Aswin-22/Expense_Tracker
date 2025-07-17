import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import axios from "axios";

function Nav() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/user/logout",
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <nav>
        <span className="logo">
          <Link to="/" className="nav-items">
            Logo
          </Link>
        </span>
        {!isAuthenticated ? (
          <ul>
            <li>
              <Link to="/user/login" className="nav-items">
                Login
              </Link>
              <Link to="/user/signup" className="nav-items">
                Signup
              </Link>
            </li>
          </ul>
        ) : (
          <>
            <span>{user.name}</span>
            <ul>
              <li>
                <Link to="/dashboard" className="nav-items">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/income" className="nav-items">
                  Income
                </Link>
              </li>
              <li>
                <Link to="/expense" className="nav-items">
                  Expense
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </>
        )}
      </nav>
    </div>
  );
}

export default Nav;
