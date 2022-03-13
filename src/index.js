const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post("/", function (req, res) {
  const data = req.body;
  console.log("req.body", data);
  res.send("api: OK");
});

// app.listen(3000, function () {});

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
