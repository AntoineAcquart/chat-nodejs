"use strict";

const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

const port = 3000;

const ServerEvent = require(path.join(__dirname, "Controller", "ServerEvent"));

const Chat = require(path.join(__dirname, "Controller", "Chat"));

app.use("/chat", Chat.router);

app.get("/", (req, res) => {
  res.json({ response: "Hello World from server.js" });
});

//Socket io
require(path.join(__dirname, "Controller", "sockets")).listen(
  http,
  ServerEvent
);

http.listen(port, () => {
  console.log(`\nListening at 127.0.0.1:${port}`);

  ServerEvent.emit("TEST");
});
