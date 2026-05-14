import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

function Nav() {
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav>
      <span className="logo">
        <Link to="/" className="nav-items">
          Logo
        </Link>
      </span>

      {loading ? (
        <div>Loading...</div>
      ) : !isAuthenticated ? (
        <ul>
          <li>
            <Link to="/user/login">Login</Link>
            <Link to="/user/signup">Signup</Link>
          </li>
        </ul>
      ) : (
        <>
          <span>{user?.name || "User"}</span>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/income">Income</Link></li>
            <li><Link to="/expense">Expense</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </>
      )}
    </nav>
  );
}

export default Nav;