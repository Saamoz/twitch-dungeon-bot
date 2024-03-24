let open = false;

addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(e.target);
  let bodyData = {};
  formData.forEach((value, key) => bodyData[key] = value);

  fetch(e.target.action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
});


async function toggleDungeon() {
  let button = document.getElementById("togglebtn")
  let overlay = document.getElementById("overlay")
  const response = fetch("/opendungeon", {
    method: "POST"
  })
  if (open) {
    open = false
    button.innerHTML = "Open Dungeon"
    overlay.style.display = ""
  } else {
    open = true
    button.innerHTML = "Close Dungeon"
    overlay.style.display = "none"
  }
}

function updateDifficultyNumber() {
  let selectDifficulty = document.getElementById("difficultySelect")
  let numberDifficulty = document.getElementById("difficultyVal")

  value_map = {
    "easy": 2,
    "medium": 5,
    "hard": 10
  }

  if (selectDifficulty.value in value_map) {
    numberDifficulty.value = value_map[selectDifficulty.value]
  }
}

async function updatePlayerList() {
  const response = await fetch("/playerlist")
  const playerlist = await response.json();
  let list = document.getElementById("playerlist");
  list.innerHTML = ''
  playerlist.forEach(p => {
    let newItem = document.createElement("li");
    const itemText = document.createTextNode(p);
    newItem.appendChild(itemText);

    list.appendChild(newItem);
  })
}