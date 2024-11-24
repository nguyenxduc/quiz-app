import React, { useState } from "react";
import "../styles/Quiz.css";

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Đáp án đã chọn
  const [showResult, setShowResult] = useState(false); // Hiển thị kết quả
  const [score, setScore] = useState(0); // Điểm số

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option); // Lưu đáp án đã chọn
  };

  const handleSubmit = () => {
    const correct = currentQuestion.correctAnswer === selectedAnswer;
    if (correct) setScore(score + 1); // Cộng điểm nếu đúng
    setShowResult(true); // Hiển thị kết quả
  };

  const handleNext = () => {
    setShowResult(false); // Ẩn kết quả
    setSelectedAnswer(null); // Reset đáp án
    setCurrentQuestionIndex(currentQuestionIndex + 1); // Chuyển sang câu hỏi tiếp theo
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-completed">
        <h1>Quiz Completed!</h1>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <button
          className="restart-button"
          onClick={() => window.location.reload()}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>The React Quiz</h2>
        <p>
          Question {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
      <div className="question-section">
        <p>{currentQuestion.question}</p>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswer === option ? "selected" : "" // Hiển thị màu khi chọn
              } ${
                showResult && option === currentQuestion.correctAnswer
                  ? "correct" // Đáp án đúng hiển thị xanh
                  : showResult && selectedAnswer === option
                  ? "incorrect" // Đáp án sai hiển thị vàng
                  : ""
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult} // Vô hiệu hóa khi đã bấm Submit
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-footer">
        {showResult ? (
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedAnswer} // Chỉ bật nút Submit nếu đã chọn đáp án
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
