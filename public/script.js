const socket = io();

const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");
const roomSelect = document.getElementById("room");

const joinContainer = document.querySelector(".join-container");
const chatContainer = document.querySelector(".chat-container");

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

const userList = document.getElementById("userList");

let currentRoom;

joinBtn.addEventListener("click", () => {

  const username = usernameInput.value;
  const room = roomSelect.value;

  if (!username) return alert("Enter username");

  currentRoom = room;

  socket.emit("joinRoom", { username, room });

  joinContainer.style.display = "none";
  chatContainer.style.display = "flex";
});

sendBtn.addEventListener("click", () => {

  const msg = msgInput.value;

  if (msg) {
    socket.emit("chatMessage", msg);
    msgInput.value = "";
  }

});



socket.on("roomUsers", (users) => {

  userList.innerHTML = "";

  users.forEach(user => {

    const li = document.createElement("li");
    li.textContent = user.username;
    userList.appendChild(li);

  });

});

socket.on("message", (msg) => {

  const li = document.createElement("li");
 li.textContent = msg;
  messages.appendChild(li);

  // Check if message contains a username (format: "Username: message")
  if (msg.includes(":")) {
    const username = msg.split(":")[0];
    li.style.backgroundColor = getUserColor(username);
    li.style.color = "#000"; // Text color (black works well on light bg)
  } else {
    // System message (e.g., join/leave)
    li.style.backgroundColor = "#f1f1f109";
    li.style.color = "#8c8c8c";
    li.style.fontStyle = "italic";
    li.style.fontSize = "1rem";
    li.style.alignText = "center";
  }

  li.textContent = msg;
  li.style.padding = "8px 12px";
  li.style.margin = "5px 0";
  li.style.borderRadius = "10px";
  li.style.display = "inline-block";
  li.style.maxWidth = "70%";


 

  // Auto-scroll
  messages.scrollTop = messages.scrollHeight;
});


// script.js

const userColors = {}; // Map username -> color
const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A", "#DDA0DD"];

function getUserColor(username) {
  if (!userColors[username]) {
    // Assign a random unused color
    const color = colors[Object.keys(userColors).length % colors.length];
    userColors[username] = color;
  }
  return userColors[username];
}