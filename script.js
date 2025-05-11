const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionsList = document.getElementById("transactions");

const circle = document.getElementById("circle");
const percentText = document.getElementById("percent-text");

const GOAL = 3000; // Set your savings goal
let balance = 0;
let transactions = [];

// Save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem("budget_transactions", JSON.stringify(transactions));
}

// Load data from localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem("budget_transactions");
  if (data) {
    transactions = JSON.parse(data);
    updateUI();
  }
}

// Add transaction
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || isNaN(amount) || amount <= 0) return;

  const transaction = {
    desc,
    amount: type === "expense" ? -amount : amount,
    type
  };

  transactions.push(transaction);
  saveToLocalStorage();
  updateUI();

  descInput.value = "";
  amountInput.value = "";
});

// Update the UI with transactions and balance
function updateUI() {
  transactionsList.innerHTML = "";
  balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.desc}: $${Math.abs(t.amount).toFixed(2)}`;
    li.classList.add(t.amount < 0 ? "expense" : "income");
    transactionsList.appendChild(li);
  });

  updateProgressCircle();
}

// Update the circular progress bar
function updateProgressCircle() {
  const percent = Math.min((balance / GOAL) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset}`;

  percentText.textContent = `$${Math.max(0, balance.toFixed(2))}`;
}

// On page load
loadFromLocalStorage();
