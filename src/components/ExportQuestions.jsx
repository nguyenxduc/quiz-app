import React from "react";
import * as XLSX from "xlsx";

const ExportQuestions = ({ questions }) => {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(questions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
    XLSX.writeFile(workbook, "questions.xlsx");
  };

  return (
    <div>
      <h1>Export Questions</h1>
      <button onClick={handleExport}>Download Questions</button>
    </div>
  );
};

export default ExportQuestions;
