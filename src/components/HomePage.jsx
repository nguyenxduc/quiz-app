import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/quiz");
  };

  return (
    <div className="home-page">
      <h2>Welcome to the Blue Quiz</h2>
      <h2>Hope you enjoy it!!!</h2>
      <button onClick={handleClick}>Click here to do the quiz</button>
    </div>
  );
};

export default HomePage;
