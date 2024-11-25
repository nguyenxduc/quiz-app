import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Quiz from "./components/Quiz";
import ImportQuestions from "./components/ImportQuestions.jsx";
import ExportQuestions from "./components/ExportQuestions.jsx";
import "./styles/App.css";
const App = () => {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/quiz" element={<Quiz questions={questions} />} />
        <Route
          path="/import"
          element={<ImportQuestions setQuestions={setQuestions} />}
        />
        <Route
          path="/export"
          element={<ExportQuestions questions={questions} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
