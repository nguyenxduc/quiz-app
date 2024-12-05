import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
const Navbar = () => {
  return (
    <nav>
      <NavLink to="/quiz">Quiz</NavLink>
      <NavLink to="/import">Import Question</NavLink>
      <NavLink to="/questions">Questions</NavLink>
      <NavLink to="/export">Export Question</NavLink>
    </nav>
  );
};

export default Navbar;
