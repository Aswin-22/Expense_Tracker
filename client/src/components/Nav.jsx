import { Link, useNavigate, NavLink } from "react-router-dom";
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
        <Link to="/">💰 Expense Tracker</Link>
      </span>

      {loading ? (
        <div className="text-muted text-sm">Loading...</div>
      ) : !isAuthenticated ? (
        <ul>
          <li>
            <NavLink to="/user/login" className="nav-items">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/signup" className="nav-items">
              Signup
            </NavLink>
          </li>
        </ul>
      ) : (
        <>
          <ul>
            <li>
              <NavLink to="/dashboard" className="nav-items">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/income" className="nav-items">
                Income
              </NavLink>
            </li>
            <li>
              <NavLink to="/expense" className="nav-items">
                Expense
              </NavLink>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Nav;