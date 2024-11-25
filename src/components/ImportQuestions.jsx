import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../styles/ImportQuestions.css"; // Nếu có file CSS riêng

const ImportQuestions = ({ setQuestions }) => {
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });

  // Hàm xử lý khi tải file Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils
        .sheet_to_json(workbook.Sheets[sheetName], {
          header: [
            "question",
            "option1",
            "option2",
            "option3",
            "option4",
            "correctAnswer",
          ],
        })
        .slice(1);

      const formattedData = data.map((row) => ({
        question: row.question,
        options: [row.option1, row.option2, row.option3, row.option4],
        correctAnswer: row.correctAnswer,
      }));

      setQuestions((prev) => [...prev, ...formattedData]);
    };

    reader.readAsBinaryString(file);
  };

  // Hàm xử lý khi nhập tay
  const handleFormSubmit = () => {
    if (
      !form.question ||
      !form.option1 ||
      !form.option2 ||
      !form.option3 ||
      !form.option4 ||
      !form.correctAnswer
    )
      return;

    const newQuestion = {
      question: form.question,
      options: [form.option1, form.option2, form.option3, form.option4],
      correctAnswer: form.correctAnswer,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setForm({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
    });
  };

  const handleClearQuestions = () => {
    setQuestions([]);
  };

  return (
    <div className="import-questions-container">
      <h1>Import Questions</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <h1>Or Add Manually</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <input
          type="text"
          placeholder="Option 1"
          value={form.option1}
          onChange={(e) => setForm({ ...form, option1: e.target.value })}
        />
        <input
          type="text"
          placeholder="Option 2"
          value={form.option2}
          onChange={(e) => setForm({ ...form, option2: e.target.value })}
        />
        <input
          type="text"
          placeholder="Option 3"
          value={form.option3}
          onChange={(e) => setForm({ ...form, option3: e.target.value })}
        />
        <input
          type="text"
          placeholder="Option 4"
          value={form.option4}
          onChange={(e) => setForm({ ...form, option4: e.target.value })}
        />
        <input
          type="text"
          placeholder="Correct Answer"
          value={form.correctAnswer}
          onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
        />
        <button className="add-button" onClick={handleFormSubmit}>
          Add Question
        </button>
        <button className="clear-button" onClick={handleClearQuestions}>
          Clear All Questions
        </button>
      </div>
    </div>
  );
};

export default ImportQuestions;
