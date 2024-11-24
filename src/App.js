import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Quiz from "./components/Quiz";
import ImportQuestions from "./components/ImportQuestions";
import ExportQuestions from "./components/ExportQuestions";
import { defaultQuestions } from "./utils/questionUtils";
import "./styles/App.css";
const App = () => {
  const [questions, setQuestions] = useState(defaultQuestions);

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
