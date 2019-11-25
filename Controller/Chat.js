"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ response: "Hello World from Chat.js" });
});

router.get("/bonjour", (req, res) => {
  res.json({ response: "chalu" });
});
module.exports.router = router;
