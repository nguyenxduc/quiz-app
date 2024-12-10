import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../styles/ImportQuestions.css";

const ImportQuestions = ({ setQuestions }) => {
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const fileInputRef = React.createRef();

  const handleImportQuestions = () => {
    const file = fileInputRef.current.files[0];

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

      setUploadedQuestions(formattedData);

      setQuestions((prev) => [...prev, ...formattedData]);
      fileInputRef.current.value = "";
    };

    reader.readAsBinaryString(file);
  };
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

    const options = [form.option1, form.option2, form.option3, form.option4];
    if (!options.includes(form.correctAnswer)) {
      alert("The correct answer must match one of the options.");
      return;
    }

    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== options.length) {
      alert("Options cannot be the same.");
      return;
    }

    const newQuestion = {
      question: form.question,
      options: options,
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

  return (
    <div className="import-questions-container">
      <div className="import-container">
        <h1>Import Questions</h1>
        <input ref={fileInputRef} type="file" accept=".xlsx, .xls" />
        <button className="import-button" onClick={handleImportQuestions}>
          Import Questions
        </button>
      </div>
      <div className="form-container">
        <h1>Or Add Manually</h1>
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
      </div>
    </div>
  );
};

export default ImportQuestions;
