const users = [];

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = (io) => {

  io.on("connection", (socket) => {

    socket.on("joinRoom", ({ username, room }) => {

      const user = { id: socket.id, username, room };
      users.push(user);

      socket.join(room);

      socket.emit("message", "Welcome to the chat!");

      socket.broadcast
        .to(room)
        .emit("message", `${username} joined ${room} room`);

      io.to(room).emit("roomUsers", getRoomUsers(room));
    });

    socket.on("chatMessage", (msg) => {

      const user = users.find(u => u.id === socket.id);

      if (user) {
        io.to(user.room).emit("message", `${user.username}: ${msg}`);
      }

    });

    socket.on("disconnect", () => {

      const index = users.findIndex(u => u.id === socket.id);

      if (index !== -1) {
        const user = users.splice(index, 1)[0];

        io.to(user.room).emit("message", `${user.username} left the room`);
        io.to(user.room).emit("roomUsers", getRoomUsers(user.room));
      }

    });

  });

};