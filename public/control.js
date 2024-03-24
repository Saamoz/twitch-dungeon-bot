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


async function dungeonOpen(doopen) {
  let button = document.getElementById("togglebtn")
  let overlay = document.getElementById("overlay")
  const resp = await fetch("/opendungeon", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({doopen: doopen})
  })
  const shouldClose = await resp.json()
  if (shouldClose) {
    button.innerHTML = "Close Dungeon"
    overlay.style.display = "none"
  } else {
    button.innerHTML = "Open Dungeon"
    overlay.style.display = ""
  }

}

async function toggleDungeon() {
  dungeonOpen(true)
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
  const playerObjects = await response.json();
  let list = document.getElementById("playerlist");
  list.innerHTML = ''

  for (const playerName in playerObjects) {
    const playerObj = playerObjects[playerName]
    const text = `${playerName} (${playerObj.xp} xp, ${playerObj.gold} gold)`

    let newItem = document.createElement("li");
    const itemText = document.createTextNode(text);
    newItem.appendChild(itemText);

    list.appendChild(newItem);

  }
}

dungeonOpen(false)

setInterval(updatePlayerList, 1000)