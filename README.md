# Rock, Paper, Scissors with Artificial Intelligence 🎮🧠

This project presents an intelligent agent developed for the classic game *Rock, Paper, Scissors*. Unlike random or static strategies often used in simple games, this agent uses **adaptive learning** and **sequential pattern analysis** to make decisions aimed at maximizing its performance.

## 🧠 How It Works

At the core of the agent's decision-making lies a **Long Short-Term Memory (LSTM)** neural network – a model designed to process sequences of data, recognize patterns over time, and build internal memory of past events. The agent analyzes the player's historical moves, integrates new inputs in real time, and improves its predictions with each new round.

For example, if a player tends to choose "scissors" after the sequence "rock–paper", the agent learns this hidden pattern and adjusts its strategy accordingly, selecting the move that is most likely to win. Over time, the agent becomes increasingly accurate, requiring the player to constantly change tactics to stay unpredictable.

## 🔧 Technical Implementation

- **Library used:** [brain.js](https://brain.js.org/) – a JavaScript library for neural networks.
- The agent updates its model after every player move using all previous rounds as input.
- Based on the predicted next move, the agent selects the **counter move**:
  - Predicts "rock" → agent chooses "paper"
  - Predicts "paper" → agent chooses "scissors"
  - Predicts "scissors" → agent chooses "rock"

## 🎓 Educational Value

Beyond being a fun and challenging game, this project has strong **educational potential**. It serves as a hands-on example of how **neural networks** and **machine learning** concepts like real-time prediction and adaptive behavior can be applied even in simple scenarios.

Students and learners can explore:
- Sequential data processing
- Real-time learning
- Practical AI without large datasets
- Pattern recognition and prediction

## 🚀 Features

- Interactive UI for playing against the AI
- Live performance chart of predictions
- Configurable parameters (pattern length, training iterations)
- Agent that **learns and evolves** as you play

## 📁 Technologies Used

- HTML, CSS, JavaScript
- brain.js (LSTM neural network)
- chart.js (performance visualization)
