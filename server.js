const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Agora Token Server is running");
});

app.get("/rtc/:channel/:uid", (req, res) => {
  const appId = process.env.APP_ID;
  const appCertificate = process.env.APP_CERTIFICATE;

  const channelName = req.params.channel;
  const uid = parseInt(req.params.uid);

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  res.json({ token });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
