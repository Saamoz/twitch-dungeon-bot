// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:4142");
let open = false;

// Connection opened
socket.addEventListener("open", (event) => {
  console.log(event)
  // socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log(event)
  // console.log("Message from server ", event.data);
});


addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(e.target);
  let bodyData = {};
  formData.forEach((value, key) => bodyData[key] = value);

  
  fetch("/say", {
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