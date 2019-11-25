"use strict";

const socketio = require("socket.io");

module.exports.listen = (http, ServerEvent) => {
  const io = socketio(http);

  io.on("connection", socket => {
    console.log("New client connected: ", socket.id);

    socket.on("message", data => {
      ServerEvent.emit("message", data, socket);
    });

    ServerEvent.on("message", data => {
      io.emit("message", data);
    });
  });
};
