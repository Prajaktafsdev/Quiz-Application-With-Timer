const questions = [
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "define", "static"],
    answer: "let"
  },
  {
    question: "What is the output of typeof null?",
    options: ["null", "undefined", "object", "number"],
    answer: "object"
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["pop()", "shift()", "push()", "slice()"],
    answer: "push()"
  },
  {
    question: "What is a closure in JavaScript?",
    options: [
      "A loop inside a function",
      "A function that remembers its outer scope",
      "A way to close the browser",
      "An array method"
    ],
    answer: "A function that remembers its outer scope"
  },
  {
    question: "Which method converts JSON text into a JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "Object.parse()"
    ],
    answer: "JSON.parse()"
  },
  {
    question: "Which keyword pauses an async function until a Promise settles?",
    options: ["wait", "pause", "await", "async"],
    answer: "await"
  },
  {
    question: "Which array method returns a new array containing matching elements?",
    options: ["filter()", "forEach()", "findIndex()", "reduce()"],
    answer: "filter()"
  },
  {
    question: "What does === check?",
    options: [
      "Value only",
      "Type only",
      "Value and type",
      "Variable name"
    ],
    answer: "Value and type"
  },
  {
    question: "Which method selects an element using a CSS selector?",
    options: [
      "document.querySelector()",
      "document.getStyle()",
      "document.selectCSS()",
      "document.findElement()"
    ],
    answer: "document.querySelector()"
  },
  {
    question: "What does Promise.all() do?",
    options: [
      "Runs only one Promise",
      "Waits for all Promises to fulfill, or rejects if one rejects",
      "Converts Promises into strings",
      "Cancels all Promises"
    ],
    answer: "Waits for all Promises to fulfill, or rejects if one rejects"
  }
];

// Select HTML elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionCount = document.getElementById("question-count");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const questionTitle = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");

const resultMessage = document.getElementById("result-message");
const scoreDisplay = document.getElementById("score");
const percentageDisplay = document.getElementById("percentage");

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerId = null;
let answered = false;

// Start a new quiz
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showQuestion();
}

// Display the current question
function showQuestion() {
  clearInterval(timerId);

  answered = false;
  timeLeft = 15;

  const currentQuestion = questions[currentQuestionIndex];

  questionCount.textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  questionTitle.textContent = currentQuestion.question;
  optionsContainer.replaceChildren();
  feedback.textContent = "";
  timerDisplay.textContent = `⏱ ${timeLeft}s`;
  timerDisplay.classList.remove("timer-warning");

  progressBar.style.width =
    `${(currentQuestionIndex / questions.length) * 100}%`;

  nextBtn.disabled = true;
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1
      ? "See Results"
      : "Next Question";

  // Create answer buttons
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;

    // Event listener for each answer
    button.addEventListener("click", () => {
      checkAnswer(option, button);
    });

    optionsContainer.appendChild(button);
  });

  startTimer();
}

// Start the countdown
function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 5) {
      timerDisplay.classList.add("timer-warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeUp();
    }
  }, 1000);
}

// Check the selected answer
function checkAnswer(selectedOption, selectedButton) {
  if (answered) return;

  answered = true;
  clearInterval(timerId);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  if (isCorrect) {
    score++;
    feedback.textContent = "Correct answer! 🎉";
    feedback.style.color = "#16a34a";
    selectedButton.classList.add("correct");
  } else {
    feedback.textContent = "Incorrect answer!";
    feedback.style.color = "#dc2626";
    selectedButton.classList.add("incorrect");
  }

  // Highlight the correct answer
  Array.from(optionsContainer.children).forEach((button) => {
    button.disabled = true;

    if (button.textContent === currentQuestion.answer) {
      button.classList.add("correct");
    }
  });

  progressBar.style.width =
    `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  nextBtn.disabled = false;
}

// Handle unanswered questions
function handleTimeUp() {
  if (answered) return;

  answered = true;

  feedback.textContent = "Time's up! ⏰";
  feedback.style.color = "#dc2626";

  Array.from(optionsContainer.children).forEach((button) => {
    button.disabled = true;

    if (button.textContent === questions[currentQuestionIndex].answer) {
      button.classList.add("correct");
    }
  });

  progressBar.style.width =
    `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  nextBtn.disabled = false;
}

// Move to the next question
function nextQuestion() {
  if (!answered) return;

  clearInterval(timerId);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Display final results
function showResults() {
  clearInterval(timerId);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const percentage = Math.round((score / questions.length) * 100);

  scoreDisplay.textContent = `${score} / ${questions.length}`;
  percentageDisplay.textContent = `Your score: ${percentage}%`;

  if (percentage >= 80) {
    resultMessage.textContent = "Excellent work! 🏆";
  } else if (percentage >= 50) {
    resultMessage.textContent = "Good job! Keep practising. 👏";
  } else {
    resultMessage.textContent = "Keep learning. You can do it! 💪";
  }
}

// Restart the quiz
function restartQuiz() {
  clearInterval(timerId);
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// Register event listeners
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);