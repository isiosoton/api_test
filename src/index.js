const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", function (req, res) {
//   res.send("Hello World!");
// });

app.post("/", function (req, res) {
  const data = req.body.events[0].message;
  console.log("req.body", data);
  res.send("api: OK");
});

// app.listen(3000, function () {});

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
