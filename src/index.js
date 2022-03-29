const express = require("express");
const request = require("request");
const app = express();
const accessToken = "NwDqtpA5cGdFEGlWGp6lDf9qvbi8pQD0x3xzYpsjGnbj9ATylulzDpsZOXsTQRjOAFU36b2M7ObWi2c9pZGqo7HAz7eOzDuKkjIGItefsUb1KiAaoi/smrLWRRTlW/CnSsVBiI1ToFl1ymhc1VWPCwdB04t89/1O/w1cDnyilFU=";
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  const data = req.body.events[0].message;
  console.log("req.body", data);
  res.send("api: OK");
  const options = {
    url: `https://api-data.line.me/v2/bot/message/${req.body.events[0].message.id}/content`,
    method: "get",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    encoding: null,
  };
  request(options, function (error, response, body) {
    const buffer = new Buffer.from(body);
    console.log(buffer);
  });
});

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
