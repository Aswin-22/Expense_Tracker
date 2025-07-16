import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import { fetchAndSetTransactions } from "./redux/transactionSlice";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  NotFound,
  Dashboard,
  Income,
  Expense,
} from "./components/index";
import Nav from "./components/Nav";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchAndSetTransactions());
  }, [dispatch]);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
