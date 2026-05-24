import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  // Don't render anything until the initial auth check has completed.
  // Prevents redirect on full page reload before checkAuth resolves.
  if (!authChecked) {
    return (
      <div className="loading-state">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
}

export default ProtectedRoute;