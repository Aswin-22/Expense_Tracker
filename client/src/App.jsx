import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  NotFound,
  Dashboard,
  Transactions,
  Reports,
} from "./components/index";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Nav />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
