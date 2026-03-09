const socket = io();

const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

button.addEventListener("click", () => {

  const msg = input.value;

  if (msg !== "") {
    socket.emit("chat message", msg);
    input.value = "";
  }

});

socket.on("chat message", (msg) => {

  const li = document.createElement("li");
  li.textContent = msg;

  messages.appendChild(li);

});