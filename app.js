let pattern = [];
let scoreHuman = 0;
let scoreAI = 0;
let scoreDraw = 0; // Dodajemo varijablu za izjednčenja
let totalGames = 0; // Ukupan broj partija
let chosenByHuman = 0;
let chosenByAI = 0;
let winner = "";
let gameCount = 0;
let patternLength = 20;
let iterations = 200;

function updatePatternLength(value) {
  patternLength = parseInt(value, 10);
  document.getElementById("patternLengthValue").innerText = value;
  resetScoreSlider();
}

function updateIterations(value) {
  iterations = parseInt(value, 10);
  document.getElementById("iterationsValue").innerText = value;
  resetScoreSlider();
}

function stringOf(integer) {
  switch (integer) {
    case 1:
      return "kamen";
    case 2:
      return "papir";
    case 3:
      return "makaze";
    default:
      return "";
  }
}

async function humanInput(rockOrPaperOrScissors) {
  chosenByHuman = rockOrPaperOrScissors;
  totalGames++;
  gameCount++;
  await whatShouldAIAnswer();
  whoIsTheWinner();
  updateUI();
  updateChart();
}

function prepareData() {
  if (pattern.length < 1) {
    for (let index = 1; index <= patternLength; index++) {
      pattern.push(Math.floor(Math.random() * 3) + 1);
    }
  }
}

// Ažuriraj obrazac nakon svakog poteza korisnika

function updatePattern() {
  if (gameCount !== 0) {
    pattern.shift();
    pattern.push(chosenByHuman);
  }
}

// AI koristi brain.js za predikciju

async function whatShouldAIAnswer() {
  prepareData();

  const net = new brain.recurrent.LSTMTimeStep();
  net.train([pattern], { iterations: iterations, log: true });

  const humanWillChoose = net.run(pattern);
  console.log(humanWillChoose);

  updatePattern();

  const roundedHumanWillChoose = Math.round(humanWillChoose);
  console.log("Human will choose: " + roundedHumanWillChoose);

  chosenByAI =
    1 <= roundedHumanWillChoose && roundedHumanWillChoose <= 3
      ? (roundedHumanWillChoose % 3) + 1
      : 1;
}
// Određivanje pobjednika

function whoIsTheWinner() {
  if (chosenByHuman === chosenByAI) {
    winner = "Neriješeno";
    scoreDraw++; // Povećaj broj izjednčenja
  } else if (
    (chosenByHuman === 1 && chosenByAI === 3) ||
    (chosenByHuman === 3 && chosenByAI === 2) ||
    (chosenByHuman === 2 && chosenByAI === 1)
  ) {
    winner = "Čovjek";
    scoreHuman++;
  } else {
    winner = "AI";
    scoreAI++;
  }
}

// Ažuriranje UI-a

function updateUI() {
  document.getElementById("humanChoice").innerText = stringOf(chosenByHuman);
  document.getElementById("winner").innerText = winner;
  document.getElementById("humanScore").innerText = scoreHuman;
  document.getElementById("aiScore").innerText = scoreAI;
  document.getElementById("drawScore").innerText = scoreDraw;
  document.getElementById("totalGames").innerText = totalGames;

  // Postavljanje emoji-ja na osnovu AI-ovog izbora
  const aiChoiceElement = document.getElementById("aiChoiceImage");
  switch (chosenByAI) {
    case 1:
      aiChoiceElement.textContent = "👊";
      break;
    case 2:
      aiChoiceElement.textContent = "✋";
      break;
    case 3:
      aiChoiceElement.textContent = "✌️";
      break;
    default:
      aiChoiceElement.textContent = "❓"; // Upitnik ako nema izbora
  }
}

// Kreiranje grafikona
const ctx = document.getElementById("scoreChart").getContext("2d");
const scoreChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Čovjek", "AI", "Neriješeno"],
    datasets: [
      {
        label: "Rezultat",
        data: [scoreHuman, scoreAI, scoreDraw],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Ažuriranje grafikona

function updateChart() {
  scoreChart.data.datasets[0].data = [scoreHuman, scoreAI, scoreDraw];
  scoreChart.update();
}

function resetScore() {
  pattern = [];
  scoreHuman = 0;
  scoreAI = 0;
  scoreDraw = 0;
  totalGames = 0;
  chosenByHuman = 0;
  chosenByAI = 0;
  winner = "";
  gameCount = 0;
  updatePatternLength(20);
  updateIterations(200);
  document.getElementById("patternLengthSlider").value = 20;
  document.getElementById("iterationsSlider").value = 200;
  updateUI();
  updateChart(); // Ažuriraj grafikon pri resetovanju
}

function resetScoreSlider() {
  pattern = [];
  scoreHuman = 0;
  scoreAI = 0;
  scoreDraw = 0;
  totalGames = 0;
  chosenByHuman = 0;
  chosenByAI = 0;
  winner = "";
  gameCount = 0;
  updateUI();
  updateChart(); // Ažuriraj grafikon pri resetovanju
}

function showPopup() {
  document.getElementById("popupWindow").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupWindow").style.display = "none";
}
