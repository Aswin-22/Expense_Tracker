import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Home() {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/user/login" replace />;
}

export default Home;