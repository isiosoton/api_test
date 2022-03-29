const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  const data = req.body.events[0].message;
  console.log("req.body", data);
  res.send("api: OK");
});

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
