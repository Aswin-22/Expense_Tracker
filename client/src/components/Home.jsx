import React from "react";
import { useSelector } from "react-redux";
function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div className="container">
      <h2>
        This is a home page, The user is{" "}
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </h2>
    </div>
  );
}

export default Home;
