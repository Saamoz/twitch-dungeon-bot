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
  const bsCollapse = new bootstrap.Collapse('#dungeonControls', {toggle: false})
  
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
    bsCollapse.show()    
  } else {
    button.innerHTML = "Open Dungeon"
    bsCollapse.hide()
  }
}

async function storeOpen(doopen) {
  let button = document.getElementById("storebtn")
  const resp = await fetch("/openstore", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({doopen: doopen})
  })
  const shouldClose = await resp.json()
  if (shouldClose) {
    button.innerHTML = "Close Store"
  } else {
    button.innerHTML = "Open Store"
  }
}

async function toggleDungeon() {
  dungeonOpen(true)
}

async function toggleStore() {
  storeOpen(true)
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
    const text = `${playerName} (level ${playerObj.level}, ${playerObj.xp} xp, ${playerObj.gold} gold)`

    let newItem = document.createElement("li");
    const itemText = document.createTextNode(text);
    newItem.appendChild(itemText);

    list.appendChild(newItem);

  }
}

dungeonOpen(false)
storeOpen(false)

setInterval(updatePlayerList, 1000)