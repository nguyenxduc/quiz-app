import React, { useState } from "react";
import * as XLSX from "xlsx";

const ImportQuestions = ({ setQuestions }) => {
  const [inputQuestions, setInputQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });

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
        .slice(1); // Skip the header row
      setQuestions(data);
    };

    reader.readAsBinaryString(file);
  };

  const handleFormSubmit = () => {
    setQuestions([...inputQuestions, form]);
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
    <div>
      <h1>Import Questions</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <h2>Or Add Manually</h2>
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
      <button onClick={handleFormSubmit}>Add Question</button>
    </div>
  );
};

export default ImportQuestions;
