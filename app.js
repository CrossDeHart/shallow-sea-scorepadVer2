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
  { name: "Incomplete Fish", icon: "incomplete.png", color: "gray" },
  { name: "Lionfish Penalty", icon: "lionfish.png", color: "red", soloOnly: true }
];

let totalPlayers = 0;
let players = [];
let scores = [];
let currentPlayer = 0;
let currentCategory = 0;
let currentScreen = -1; //splash screen

const app = document.getElementById("app");

function render() {
  app.innerHTML = "";

  //splash screen
  if (currentScreen === -1){
    renderSplashScreen();
    return;
  }

  if (totalPlayers === 0) {
    renderPlayerCountScreen();
  } else if (players.length < totalPlayers) {
    renderPlayerNameScreen();
  } else if (currentPlayer < totalPlayers) {
    if (currentCategory < getActiveCategories().length) {
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

function renderSplashScreen(){
  const screen = document.createElement("div");
  screen.className = "screen splash";

  const title = document.createElement("h1");
  title.textContent = "Welcome to the Shallow Sea Scorepad!";
  screen.appendChild(title);

  app.appendChild(screen);

  //Fade out after 2.5 seconds, then go to player count.
  setTimeout(() => {
    screen.classList.add("fade-out");
      setTimeout(() => {
        currentScreen = 0;
        render();
      }, 1000); //wait for fade out animation to finish.
  }, 2500);
}

function getActiveCategories() {
  return categories.filter(cat => !(cat.soloOnly && totalPlayers > 1));
}

function renderPlayerCountScreen() {
  const screen = document.createElement("div");
  screen.className = "screen";

  screen.innerHTML = `<h1>How Many Players?</h1>`;

  // 2x2 Button Grid for player count
  const buttonGrid = document.createElement("div");
  buttonGrid.style.display = "grid";
  buttonGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
  buttonGrid.style.gap = "10px";
  buttonGrid.style.marginTop = "20px";

  [1, 2, 3, 4].forEach(num => {
    const btn = document.createElement("button");
    btn.textContent = `${num} Player${num > 1 ? "s" : ""}`;
    btn.addEventListener("click", () => {
      totalPlayers = num;
      players = [];
      scores = Array.from({ length: totalPlayers }, () =>
        Array(getActiveCategories().length).fill(0)
      );
      render();
    });
    buttonGrid.appendChild(btn);
  });

  screen.appendChild(buttonGrid);
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

  const category = getActiveCategories()[currentCategory];

  // Player + category name
  const label = document.createElement("h2");
  label.textContent = `${players[currentPlayer]}: ${category.name}`;
  screen.appendChild(label);

  // Image + input container
  const wrapper = document.createElement("div");
  wrapper.className = "category-wrapper";

  const img = document.createElement("img");
  img.src = `images/${category.icon}`;
  img.alt = category.name;
  img.className = "category-image";
  wrapper.appendChild(img);

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

  // Buttons container
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
      currentCategory = getActiveCategories().length - 1;
    }
    render();
  });
  buttonsContainer.appendChild(backBtn);

  const nextBtn = document.createElement("button");
    if (currentCategory === getActiveCategories().length - 1) {
      if (currentPlayer === totalPlayers - 1) {
    nextBtn.textContent = "Show Scores";
  }   else {
    nextBtn.textContent = "Next Player";
  }
}   else {
  nextBtn.textContent = "Next";
}

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

    // Apply Lionfish penalty only for solo play
    if (totalPlayers === 1) {
      const lionfishIndex = getActiveCategories().findIndex(c => c.name === "Lionfish Penalty");
      if (lionfishIndex !== -1) {
        const lionfishCount = scores[pIndex][lionfishIndex];
        if (lionfishCount > 2) {
          total -= (lionfishCount - 2) * 2;
        }
      }
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
    currentScreen = -1; //reset to splash screen
    render();
  });

  screen.appendChild(resetBtn);
  app.appendChild(screen);
}

// Start app
render();
