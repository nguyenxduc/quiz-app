import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Quiz.css";
import ExcelJS from "exceljs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timer, setTimer] = useState(10);
  const [showStatistics, setShowStatistics] = useState(false);

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
    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        options: questions[currentQuestionIndex].options,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        selectedAnswer: selectedAnswer,
        timeSpent: 10 - timer, // time spent on the question
        isCorrect: isCorrect,
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
    setShowStatistics(false);
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

  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const incorrectAnswers = userAnswers.length - correctAnswers;
  const averageTimeSpent = userAnswers.length
    ? userAnswers.reduce((acc, answer) => acc + answer.timeSpent, 0) /
      userAnswers.length
    : 0;

  const dataForStatistics = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        label: "Results",
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["green", "red"],
        borderColor: ["darkgreen", "darkred"],
        borderWidth: 1,
        barPercentage: 1.0, // Các cột chiếm tối đa không gian của nhóm
        categoryPercentage: 0.2, // Giảm mạnh khoảng cách giữa các nhóm
        barThickness: "flex", // Để tự động căn chỉnh kích thước cột
      },
    ],
  };

  const optionsForStatistics = {
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }, // Loại bỏ padding mặc định để cột gần nhau hơn
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Quiz Statistics",
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  if (showStatistics) {
    return (
      <div className="statistics-container">
        <h2>Statistics</h2>
        <div className="chart-container">
          <Bar data={dataForStatistics} options={optionsForStatistics} />
        </div>
        <div className="summary">
          <p>
            <strong>Correct Answers:</strong> {correctAnswers} /{" "}
            {userAnswers.length}
          </p>
          <p>
            <strong>Incorrect Answers:</strong> {incorrectAnswers} /{" "}
            {userAnswers.length}
          </p>
          <p>
            <strong>Average Time Spent:</strong> {averageTimeSpent.toFixed(2)}{" "}
            seconds
          </p>
        </div>

        <div>
          <button className="restart-button" onClick={handleRestart}>
            Back to Quiz
          </button>
          <button className="restart-button" onClick={handleExportResults}>
            Export Results
          </button>
        </div>
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
          <button
            className="restart-button"
            onClick={() => setShowStatistics(true)}
          >
            View Statistics
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
