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

// Lionfish category info (only for 1 player)
const lionfishCategory = { name: "Lionfish", icon: "lionfish.png", color: "red" };

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
    const maxCategories = totalPlayers === 1 ? categories.length + 1 : categories.length;
    if (currentCategory < maxCategories) {
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

  // Create a container div for buttons
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "grid";
  btnContainer.style.gridTemplateColumns = "repeat(2, 120px)";
  btnContainer.style.gridGap = "15px";
  btnContainer.style.justifyContent = "center";
  btnContainer.style.marginTop = "20px";

  for (let i = 1; i <= 4; i++) {
    const btn = document.createElement("button");
    btn.textContent = i === 1 ? "1 Player" : `${i} Players`;
    btn.style.width = "120px";
    btn.style.height = "50px";
    btn.addEventListener("click", () => {
      totalPlayers = i;
      players = [];
      scores = Array.from({ length: totalPlayers }, () =>
        Array(categories.length + (totalPlayers === 1 ? 1 : 0)).fill(0)
      );
      render();
    });
    btnContainer.appendChild(btn);
  }

  screen.appendChild(btnContainer);
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

  let category;
  if (totalPlayers === 1 && currentCategory === categories.length) {
    // Show lionfish category only for 1 player at last input
    category = lionfishCategory;
  } else {
    category = categories[currentCategory];
  }

  // Card container wrapping title, image, and input
  const card = document.createElement("div");
  card.className = "category-card";

  // Title
  const label = document.createElement("h2");
  label.textContent = `${players[currentPlayer]}: ${category.name}`;
  card.appendChild(label);

  // Wrapper for image + input
  const wrapper = document.createElement("div");
  wrapper.className = "category-wrapper";

  const img = document.createElement("img");
  img.src = `images/${category.icon}`;
  img.alt = category.name;
  img.className = "category-image";
  wrapper.appendChild(img);

  const input = document.createElement("input");
  input.type = "number";
  input.min = 0;
  input.placeholder = "Score";
  input.value = scores[currentPlayer][currentCategory];
  input.className = "score-input";
  input.addEventListener("input", e => {
    scores[currentPlayer][currentCategory] = parseInt(e.target.value || 0);
  });
  wrapper.appendChild(input);

  card.appendChild(wrapper);
  screen.appendChild(card);

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
      currentCategory = (totalPlayers === 1 ? categories.length : categories.length - 1);
    }
    render();
  });
  buttonsContainer.appendChild(backBtn);

  const nextBtn = document.createElement("button");
  const maxCategories = totalPlayers === 1 ? categories.length + 1 : categories.length;
  nextBtn.textContent =
    currentCategory === maxCategories - 1 ? "Next Player" : "Next";
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
    let total = scores[pIndex].reduce((a, b) => a + b, 0);

    // Subtract lionfish penalty only if 1 player
    if (totalPlayers === 1) {
      const lionfishCount = scores[pIndex][categories.length] || 0;
      const penaltyFish = Math.max(0, lionfishCount - 2);
      const penalty = penaltyFish * 2;
      total -= penalty;
    }

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
