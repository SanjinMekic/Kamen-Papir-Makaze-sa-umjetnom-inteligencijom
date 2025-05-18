let pattern = []; // Niz koji čuva historiju poteza igraca za AI predvidjanje
let scoreHuman = 0; // Broji pobjede igraca
let scoreAI = 0; // Broji pobjede AI-a
let scoreDraw = 0; // Varijablu za izjednčenja
let totalGames = 0; // Ukupan broj partija
let chosenByHuman = 0; // Trenutni izbor igrača (1 = kamen, 2 = papir, 3 = makaze)
let chosenByAI = 0; // Trenutni izbor AI-a
let winner = ""; // Cuva rezultat partije ("Covjek", "AI", "Nerijeseno")
let gameCount = 0; // Broji partije u trenutnoj sesiji
let patternLength = 20; // Konfigurabilna dužina historije poteza (defaultno 20)
let iterations = 200; // Konfigurabilni broj iteracija za LSTM trening (defaultno 200)

/**
 * Funkcija updatePatternLength() postavlja
 * duzinu historije poteza (patternLength),
 * promjena ovog broja mijenja tacnost modela
 */

function updatePatternLength(value) {
  patternLength = parseInt(value, 10);
  document.getElementById("patternLengthValue").innerText = value;
  resetScoreSlider();
}

/**
 * Funkcija updateIterations() postavlja
 * broj itercija za treniranje modela (iterations),
 * promjena ovog broja mijenja tacnost modela
 */

function updateIterations(value) {
  iterations = parseInt(value, 10);
  document.getElementById("iterationsValue").innerText = value;
  resetScoreSlider();
}

/**
 * Ova funkcija konvertuje broj poslan kroz onClick metodu u html-u
 * u string (kamen, papir, makaze)
 */

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

/**
 * Ova funkcija vrsi obradu unosa igraca i pozivanje AI odgovora,
 * uz updateovanje interfejsa
 */

async function humanInput(rockOrPaperOrScissors) {
  chosenByHuman = rockOrPaperOrScissors;
  totalGames++;
  gameCount++;
  await whatShouldAIAnswer();
  whoIsTheWinner();
  updateUI();
  updateChart();
}

/**
 * U ovoj funkciji se inizijalizuje historija poteza
 * ukoliko je prazna, radi na nacin da generise nasumicne poteze
 * od 1-3 kako bi se niz popunio, a duzina niza je svakako odredjena sa
 * patternLength cijom duzinom se upravlja preko UI
 */

function prepareData() {
  if (pattern.length < 1) {
    for (let index = 1; index <= patternLength; index++) {
      pattern.push(Math.floor(Math.random() * 3) + 1);
    }
  }
}

/**
 * Funkcija azurira pattern nakon svakog poteza korisnika,
 * radi na nacin da se uklanja najstariji potez iz niza,
 * a nakon toga se doda novi potez na kraj niza
 */

function updatePattern() {
  if (gameCount !== 0) {
    pattern.shift();
    pattern.push(chosenByHuman);
  }
}

/**
 * Ova funkcija sluzi za predvidjanje iduceg poteza igraca
 * i bira najbolji odgovor, koristi se LSTM neuronska mreza.
 * Model se trenira na osnovu historije poteza i predvidja
 * sljedeci potez igraca. Nakon toga azurira historiju poteza i
 * biramo pobjednicki potez na nacin:
 *    - Ako AI predvidi da će igrac izabrati 1 (kamen), AI bira 2 (papir)
 *    - Ako predvidi 2 (papir), AI bira 3 (makaze).
 *    - Ako predvidi 3 (makaze), AI bira 1 (kamen).
 */

async function whatShouldAIAnswer() {
  prepareData();

  const net = new brain.recurrent.LSTMTimeStep();
  net.train([pattern], { iterations: iterations, log: true });

  const humanWillChoose = net.run(pattern);
  console.log(humanWillChoose);

  updatePattern();

  const roundedHumanWillChoose = Math.round(humanWillChoose);
  console.log("Response: " + roundedHumanWillChoose);

  chosenByAI =
    1 <= roundedHumanWillChoose && roundedHumanWillChoose <= 3
      ? (roundedHumanWillChoose % 3) + 1
      : 1;
}

// Funkcija koja odredjuje pobjednika u svakoj partiji

function whoIsTheWinner() {
  if (chosenByHuman === chosenByAI) {
    winner = "Neriješeno";
    scoreDraw++;
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

/**
 * Ova funkcija updateuje UI sa novim podacima,
 * prikazuje izbor igraca u tekstualnom obliku,
 * Prikazuje pobjednika, azurira broj pobjeda igraca i AI-a i
 * broja nerijesenih partija i ukupan broj partija.
 * Postavlja emoji za potez koji je napravio AI.
 */

function updateUI() {
  document.getElementById("humanChoice").innerText = stringOf(chosenByHuman);
  document.getElementById("winner").innerText = winner;
  document.getElementById("humanScore").innerText = scoreHuman;
  document.getElementById("aiScore").innerText = scoreAI;
  document.getElementById("drawScore").innerText = scoreDraw;
  document.getElementById("totalGames").innerText = totalGames;

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
      aiChoiceElement.textContent = "❓";
  }
}

/**
 * Funkcija sluzi za inicijalizaciju grafika koristeci
 * chart.js za vizualni prikaz rezultata
 * u pitanju je bar chart sa sljedecim poretkom:
 *   - X osa: ["Covjek", "AI", "Nerijeseno"]
 *   - Y osa: pocinje od 0.
 * - Boje:
 *   - Igrac: zelena
 *   - AI: crvena
 *   - Nerijeseno: zuta
 */

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

/**
 * Ova funkcija postavlja nove vrijednosti za graf i
 * nakon toga ga ponovo iscrta
 */

function updateChart() {
  scoreChart.data.datasets[0].data = [scoreHuman, scoreAI, scoreDraw];
  scoreChart.update();
}

/**
 * Funkcija sluzi da resetuje sve globalne varijable
 * na pocetnu vrijednost, vraca postavke za patternLength
 * i iterations na defaultne (20 i 200), i azurira UI i graf
 */

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
  updatePatternLength(20);
  updateIterations(200);
  document.getElementById("patternLengthSlider").value = 20;
  document.getElementById("iterationsSlider").value = 200;
  updateUI();
  updateChart();
}

// Otvara popup

function showPopup() {
  document.getElementById("popupWindow").style.display = "flex";
}

// Zatvara popup

function closePopup() {
  document.getElementById("popupWindow").style.display = "none";
}
