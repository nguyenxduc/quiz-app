import React, { useState } from "react";
import "../styles/Questions.css";

const Questions = ({ questions, setQuestions }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState([]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");

  const handleDelete = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleClearQuestions = () => {
    setQuestions([]);
  };

  const handleEdit = (index) => {
    const question = questions[index];
    setEditingIndex(index);
    setNewQuestion(question.question);
    setNewOptions(question.options);
    setNewCorrectAnswer(question.correctAnswer);
  };

  const handleSaveEdit = () => {
    const hasDuplicateOptions = newOptions.some(
      (option, idx) => newOptions.indexOf(option) !== idx
    );

    const isCorrectAnswerValid = newOptions.includes(newCorrectAnswer);

    if (hasDuplicateOptions) {
      alert("Options cannot be the same.");
      return;
    }

    if (!isCorrectAnswerValid) {
      alert("The correct answer must match one of the options.");
      return;
    }

    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = {
      ...updatedQuestions[editingIndex],
      question: newQuestion,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    };
    setQuestions(updatedQuestions);
    setEditingIndex(null);
  };

  const handleOptionChange = (idx, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[idx] = value;
    setNewOptions(updatedOptions);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="no-question-container">
        <h1>No questions</h1>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="questions-body">
        <button className="clear-button" onClick={handleClearQuestions}>
          Delete All Questions
        </button>
        <div className="questions-list">
          {questions.map((question, currentQuestionIndex) => (
            <div key={currentQuestionIndex} className="question-item">
              <div className="question-content">
                <p className="question-text">{question.question}</p>
                <div className="options-container">
                  {question.options.map((option, idx) => (
                    <div key={idx} className="option-container">
                      <i className="fa fa-circle option-icon"></i>
                      <p className="option-text">
                        {`Option ${idx + 1}: ` + option}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="correct-answer">
                  <p>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </p>
                </div>
              </div>
              <button
                className="edit-button"
                onClick={() => handleEdit(currentQuestionIndex)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(currentQuestionIndex)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Edit Question Modal */}
        {editingIndex !== null && (
          <div className="edit-question-form">
            <div
              className="overlay"
              onClick={() => setEditingIndex(null)}
            ></div>
            <div className="edit-modal">
              <h3>Edit Question</h3>

              <label htmlFor="question">Question:</label>
              <input
                type="text"
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter question"
              />

              <label htmlFor="option1">Option 1:</label>
              <input
                type="text"
                id="option1"
                value={newOptions[0] || ""}
                onChange={(e) => handleOptionChange(0, e.target.value)}
                placeholder="Option 1"
              />

              <label htmlFor="option2">Option 2:</label>
              <input
                type="text"
                id="option2"
                value={newOptions[1] || ""}
                onChange={(e) => handleOptionChange(1, e.target.value)}
                placeholder="Option 2"
              />

              <label htmlFor="option3">Option 3:</label>
              <input
                type="text"
                id="option3"
                value={newOptions[2] || ""}
                onChange={(e) => handleOptionChange(2, e.target.value)}
                placeholder="Option 3"
              />

              <label htmlFor="option4">Option 4:</label>
              <input
                type="text"
                id="option4"
                value={newOptions[3] || ""}
                onChange={(e) => handleOptionChange(3, e.target.value)}
                placeholder="Option 4"
              />

              <label htmlFor="correctAnswer">Correct Answer:</label>
              <input
                type="text"
                id="correctAnswer"
                value={newCorrectAnswer}
                onChange={(e) => setNewCorrectAnswer(e.target.value)}
                placeholder="Enter correct answer"
              />

              <button className="save-button" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="cancel-button"
                onClick={() => setEditingIndex(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
