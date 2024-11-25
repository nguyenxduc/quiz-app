import React from "react";
import * as XLSX from "xlsx";
import "../styles/ExportQuestions.css";
const ExportQuestions = ({ questions }) => {
  const handleExport = () => {
    if (!questions || questions.length === 0) {
      alert("No questions available to export!");
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      Question: q.question,
      "Option 1": q.options[0],
      "Option 2": q.options[1],
      "Option 3": q.options[2],
      "Option 4": q.options[3],
      "Correct Answer": q.correctAnswer,
    }));

    // Tạo Workbook và Sheet
    const worksheet = XLSX.utils.json_to_sheet(formattedQuestions, {
      header: [
        "Question",
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Correct Answer",
      ],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

    XLSX.writeFile(workbook, "questions.xlsx");
  };

  return (
    <div className="export-container">
      <h1>Export Questions</h1>
      <button className="download-button" onClick={handleExport}>
        Download Questions
      </button>
    </div>
  );
};

export default ExportQuestions;
