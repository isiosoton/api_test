const express = require("express");
const request = require("request");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const accessToken = "DpMVi4S6+PpktL5GhoppoXn76ERRf+Alfbz+Tl5MNb8dGJWB7ifs4fAE/n1Qksbuy9E4cjq4D9f6gI2w9bOyZ+53H7aHBxMdrVG5yTlm9a5iRiK6O5mX1xNbo2tR00VFhnx92fTpo0q+rPGUMGDDbAdB04t89/1O/w1cDnyilFU=";

app.post("/", function (req, res) {
  const messageId = req.body["events"][0]["message"]["id"];
  const replyToken = req.body["events"][0]["replyToken"];
  //console.log(req.body);
  console.log(messageId);
  //console.log(replyToken);
  res.send("api: Hello World!");

  const options = {
    uri: `https://api-data.line.me/v2/bot/message/${req.body.events[0].message.id}/content`,
    method: "get",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    encoding: null,
  };

  //LINEからVercell
  request(options, function (error, response, body) {
    //バイナリデータに変換
    const buffer = new Buffer.from(body);
    console.log(buffer);

    //node.jsから画像を取得
    //fs.writeFileSync('./testa.jpg', buffer, 'binary');

    //VercelからCustom Vision
    const option = {
      uri: "https://panama.cognitiveservices.azure.com/customvision/v3.0/Prediction/827c13e4-0a7e-406d-9748-9c92e3b6ac3d/classify/iterations/Iteration1/image",
      method: "post",
      headers: {
        "Content-Type": "application/octet-stream",
        "Prediction-Key": "45c6c20d2a9c4a6092deb74db83b8c9e",
      },
      body: buffer,
    };

    //Costom VisionからVercel
    //以下記入
    request.post(option, function (error, res, body) {
      const resBody = JSON.parse(body);
      const tagName = resBody.predictions;

      tagName.sort(function (first, second) {
        return second.probability - first.probability;
      });

      console.log(tagName[0]);

      const messageData = {
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: "これは" + tagName[0]["tagName"] + "です",
          },
          {
            type: "text",
            text: "確率は" + tagName[0]["probability"] * 100 + "%です",
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

      //VercelからLINE
      request.post(optionsLine, function (error, res, body) {
        console.log(body);
      });
    });
    //console.log(body);
  });
});

//モジュール
process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT); //Vercell用
