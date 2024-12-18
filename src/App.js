import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Quiz from "./components/Quiz";
import ImportQuestions from "./components/ImportQuestions.jsx";
import ExportQuestions from "./components/ExportQuestions.jsx";
import "./styles/App.css";
import Questions from "./components/Questions.jsx";
import HomePage from "./components/HomePage.jsx";

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
        <Route path="/quiz-app" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz questions={questions} />} />
        <Route
          path="/import"
          element={<ImportQuestions setQuestions={setQuestions} />}
        />
        <Route
          path="/export"
          element={<ExportQuestions questions={questions} />}
        />
        <Route
          path="/questions"
          element={
            <Questions
              questions={questions}
              setQuestions={setQuestions}
            ></Questions>
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
