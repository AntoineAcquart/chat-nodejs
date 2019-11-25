"use strict";

const socketio = require("socket.io");

module.exports.listen = (server, ServerEvent) => {
  const io = socketio(server);

  io.on("connection", socket => {
    console.log("New client connected: ", socket.id);
  });
};
