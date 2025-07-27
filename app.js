const categories = [
  { name: "Turtle Island", icon: "turtle.png", color: "green" },
  { name: "Orange Ecosystem", icon: "orange.png", color: "orange" },
  { name: "Blue Ecosystem", icon: "blue.png", color: "blue" },
  { name: "First Row", icon: "ocean.png", color: "teal" },
  { name: "Second Row", icon: "ocean.png", color: "teal" },
  { name: "Third Row", icon: "ocean.png", color: "teal" },
  { name: "Fourth Row", icon: "ocean.png", color: "teal" },
  { name: "Fifth Row", icon: "ocean.png", color: "teal" },
  { name: "Differing Completed Sealife", icon: "sealife.png", color: "purple" },
  { name: "Incomplete Fish", icon: "incomplete.png", color: "gray" }
];

let totalPlayers = 0;
let players = [];
let scores = [];
let currentPlayer = 0;
let currentCategory = 0;

const app = document.getElementById("app");

function render() {
  app.innerHTML = "";

  if (totalPlayers === 0) {
    renderPlayerCountScreen();
  } else if (players.length < totalPlayers) {
    renderPlayerNameScreen();
  } else if (currentPlayer < totalPlayers) {
    if (currentCategory < categories.length) {
      renderCategoryScreen();
    } else {
      currentPlayer++;
      currentCategory = 0;
      render();
    }
  } else {
    renderSummaryScreen();
  }
}

function renderPlayerCountScreen() {
  const screen = document.createElement("div");
  screen.className = "screen";

  screen.innerHTML = `<h1>How Many Players?</h1>`;
  const select = document.createElement("select");
  select.innerHTML = `
    <option value="">Select</option>
    <option value="1">1 Player</option>
    <option value="2">2 Players</option>
    <option value="3">3 Players</option>
    <option value="4">4 Players</option>
  `;
  select.addEventListener("change", e => {
    totalPlayers = parseInt(e.target.value);
    players = [];
    scores = Array.from({ length: totalPlayers }, () =>
      Array(categories.length).fill(0)
    );
    render();
  });

  screen.appendChild(select);
  app.appendChild(screen);
}

function renderPlayerNameScreen() {
  const screen = document.createElement("div");
  screen.className = "screen";

  screen.innerHTML = `<h1>Enter Player ${players.length + 1} Name</h1>`;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Player ${players.length + 1}`;
  screen.appendChild(input);

  const btn = document.createElement("button");
  btn.textContent = "Next";
  btn.addEventListener("click", () => {
    players.push(input.value || `Player ${players.length + 1}`);
    render();
  });

  screen.appendChild(btn);
  app.appendChild(screen);
}

function renderCategoryScreen() {
  const screen = document.createElement("div");
  screen.className = "screen";

  const category = categories[currentCategory];

  // Player + category name
  const label = document.createElement("h2");
  label.textContent = `${players[currentPlayer]}: ${category.name}`;
  screen.appendChild(label);

  // ALWAYS wrap image + input in a container
  const wrapper = document.createElement("div");
  wrapper.className = "category-wrapper";

  // Category image
  const img = document.createElement("img");
  img.src = `images/${category.icon}`;
  img.alt = category.name;
  img.className = "category-image";
  wrapper.appendChild(img);

  // Score input
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Score";
  input.value = scores[currentPlayer][currentCategory];
  input.className = "score-input";
  input.addEventListener("input", e => {
    scores[currentPlayer][currentCategory] = parseInt(e.target.value || 0);
  });
  wrapper.appendChild(input);

  screen.appendChild(wrapper);

  // Navigation buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons-container";

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.className = "secondary";
  backBtn.addEventListener("click", () => {
    if (currentCategory > 0) {
      currentCategory--;
    } else if (currentPlayer > 0) {
      currentPlayer--;
      currentCategory = categories.length - 1;
    }
    render();
  });
  buttonsContainer.appendChild(backBtn);

  const nextBtn = document.createElement("button");
  nextBtn.textContent =
    currentCategory === categories.length - 1 ? "Next Player" : "Next";
  nextBtn.addEventListener("click", () => {
    currentCategory++;
    render();
  });
  buttonsContainer.appendChild(nextBtn);

  screen.appendChild(buttonsContainer);
  app.appendChild(screen);
}

function renderSummaryScreen() {
  const screen = document.createElement("div");
  screen.className = "screen";

  screen.innerHTML = `<h2>Final Totals</h2>`;
  const ul = document.createElement("ul");
  ul.className = "summary-list";

  players.forEach((player, pIndex) => {
    const total = scores[pIndex].reduce((a, b) => a + b, 0);
    const li = document.createElement("li");
    li.innerHTML = `<span>${player}</span> <span>${total}</span>`;
    ul.appendChild(li);
  });

  screen.appendChild(ul);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Start Over";
  resetBtn.addEventListener("click", () => {
    totalPlayers = 0;
    players = [];
    scores = [];
    currentPlayer = 0;
    currentCategory = 0;
    render();
  });

  screen.appendChild(resetBtn);
  app.appendChild(screen);
}

// Start app
render();
