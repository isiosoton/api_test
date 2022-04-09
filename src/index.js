const express = require("express");
const request = require("request");
const app = express();
const accessToken = "NwDqtpA5cGdFEGlWGp6lDf9qvbi8pQD0x3xzYpsjGnbj9ATylulzDpsZOXsTQRjOAFU36b2M7ObWi2c9pZGqo7HAz7eOzDuKkjIGItefsUb1KiAaoi/smrLWRRTlW/CnSsVBiI1ToFl1ymhc1VWPCwdB04t89/1O/w1cDnyilFU=";
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  const data = req.body.events[0].message;
  const replyToken = req.body["events"][0]["replyToken"];

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
    const option = {
      uri: "https://leadhacktesteastjapan-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/3995706a-5622-438d-afce-71de27a57ca5/classify/iterations/Iteration1/image",
      method: "post",
      headers: {
        "Content-Type": "application/octet-stream",
        "Prediction-Key": "034d56b2970f4167b38c1278b84ecdb7",
      },
      body: buffer,
    };

    request.post(option, function (error, res, body) {
      console.log(body);
      console.log(replyToken);
      // const resBody = JSON.parse(body);

      const messageData = {
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: "res.OK",
          },
        ],
      };

      const optionsLine = {
        uri: "https://api.line.me/v2/bot/message/reply",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        json: messageData,
      };

      // const optionLINE = JSON.stringify(optionsLine);
      request.post(optionsLine, function (error, res, body) {
        console.log("test OK");
      });
    });
  });
});

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
