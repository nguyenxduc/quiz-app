import React, { useState, useEffect } from "react";

import "../styles/Quiz.css";
import ExcelJS from "exceljs";

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (
      isQuizStarted &&
      timer > 0 &&
      !showResult &&
      currentQuestionIndex < questions.length
    ) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0 && !showResult) {
      handleSubmit();
    }
  }, [
    timer,
    isQuizStarted,
    showResult,
    currentQuestionIndex,
    questions.length,
  ]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    const isCorrect =
      questions[currentQuestionIndex].correctAnswer === selectedAnswer;

    console.log(selectedAnswer);
    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        options: questions[currentQuestionIndex].options,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        selectedAnswer: selectedAnswer,
      },
    ]);
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
    setTimer(10);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setUserAnswers([]);
    setTimer(10);
    setIsQuizStarted(false);
  };

  const handleExportResults = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Quiz Results");

    worksheet.columns = [
      { header: "Question", key: "question", width: 30 },
      { header: "Option 1", key: "option1", width: 15 },
      { header: "Option 2", key: "option2", width: 15 },
      { header: "Option 3", key: "option3", width: 15 },
      { header: "Option 4", key: "option4", width: 15 },
    ];

    userAnswers.forEach((answer) => {
      const row = worksheet.addRow({
        question: answer.question,
        option1: answer.options[0],
        option2: answer.options[1],
        option3: answer.options[2],
        option4: answer.options[3],
      });

      const correctAnswerIndex =
        answer.options.indexOf(answer.correctAnswer) + 2;
      row.getCell(correctAnswerIndex).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "22A0DD" },
      };

      if (answer.selectedAnswer !== answer.correctAnswer) {
        const selectedAnswerIndex =
          answer.options.indexOf(answer.selectedAnswer) + 2;
        row.getCell(selectedAnswerIndex).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFA84C" },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_results.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="no-quiz-container">
        <h1>No questions available</h1>
        <p>Please add or import questions to start the quiz!</p>
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-completed">
        <h1>Quiz Completed!</h1>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <div>
          <button className="restart-button" onClick={handleRestart}>
            Restart Quiz
          </button>
          <button className="export-button" onClick={handleExportResults}>
            Export Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>The Blue Quiz</h2>
      </div>
      <div className="quiz-body">
        {!isQuizStarted ? (
          <div className="start-quiz">
            <button
              className="start-button"
              onClick={() => setIsQuizStarted(true)}
            >
              Start
            </button>
          </div>
        ) : (
          <>
            <p className="question-progress">
              Question{" "}
              <span className="current-index">{currentQuestionIndex + 1}</span>{" "}
              / {questions.length}
            </p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="timer">
              Time Left:<strong> {timer} </strong> seconds
            </p>

            <div className="question-section">
              <p className="question">
                {questions[currentQuestionIndex].question}
              </p>
              <div className="options-container">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`option-button ${
                        selectedAnswer === option ? "selected" : ""
                      } ${
                        showResult &&
                        option === questions[currentQuestionIndex].correctAnswer
                          ? "correct"
                          : showResult && selectedAnswer === option
                          ? "incorrect"
                          : ""
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="quiz-footer">
              {showResult ? (
                <button
                  className="next-button"
                  onClick={handleNext}
                  disabled={currentQuestionIndex >= questions.length}
                >
                  {currentQuestionIndex + 1 < questions.length
                    ? "Next"
                    : "Finish"}
                </button>
              ) : (
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                >
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
