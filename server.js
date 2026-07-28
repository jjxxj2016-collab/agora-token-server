const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Agora Token Server is running");
});

app.get("/rtcToken", (req, res) => {
  const appId = process.env.APP_ID;
  const appCertificate = process.env.APP_CERTIFICATE;

  const channelName = req.query.channelName;
  const uid = parseInt(req.query.uid || "0");
  const role = req.query.role === "subscriber"
    ? RtcRole.SUBSCRIBER
    : RtcRole.PUBLISHER;

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: "APP_ID or APP_CERTIFICATE missing" });
  }

  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime =
    currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  res.json({
    rtcToken: token,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
