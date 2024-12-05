import React from "react";
import "../styles/Questions.css";

const Questions = ({ questions, setQuestions }) => {
  const handleDelete = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };
  const handleClearQuestions = () => {
    setQuestions([]);
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
                    <strong>Correct Answer:</strong>{" "}
                    {questions[currentQuestionIndex].correctAnswer}
                  </p>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(currentQuestionIndex)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
