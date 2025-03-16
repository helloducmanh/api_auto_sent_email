const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const API_URL = 'http://localhost:5000/monitor-email'; // Thay thế bằng URL thật của API C#

app.use(express.json());

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCallData() {

  const duration = getRandomInt(100, 600);
  const queueTime = getRandomInt(0, duration * 0.3);
  const ringTime = getRandomInt(0, duration * 0.1);
  const ivrTime = getRandomInt(0, duration * 0.2);
  const talkTime = duration - (queueTime + ringTime + ivrTime);

    return {
        id: "5007b476-dd61-4f35-a158-ae2bc085662c",
        phoneNumber: "0913330986",
        dialedNumber: "1000000020",
        direction: "inbound",
        autoCall: false,
        missCall: false,
        autoCallType: null,
        startEpoch: 1742023210,
        endEpoch: Math.floor(Date.now() / 1000) + 300,
        answerEpoch: Math.floor(Date.now() / 1000) + 10,
        duration,
        queueTime,
        ringTime,
        ivrTime,
        talkTime,
        callStatus: "HANDLED",
        callStatusReason: null,
        recordingUrl: null,
        campaignId: null,
        queueId: null,
        queueName: null,
        transferDestinations: null,
        forwardedNumber: null,
        hangupBy: "agent",
        insertTime: Date.now(),
        domainId: "e0f035a3-d1d5-47d8-93c7-82105890e45e",
        extraVariables: null,
        AgentCallHistories: [],
        TransferHistories: []
    };
}

const https = require('https');

const agent = new https.Agent({  
    rejectUnauthorized: false // Bỏ qua xác thực SSL
});

app.post('/call-aggregate', async (req, res) => {
  try {
      const requests = [];
      for (let i = 0; i < 10; i++) {
          const callData = generateCallData();
          requests.push(
              axios.post(API_URL, callData, {
                  headers: { 'Content-Type': 'application/json' },
                  httpsAgent: agent
              })
          );
      }
      
      const responses = await Promise.all(requests);
      res.status(200).json({ message: '10 calls sent successfully', responses: responses.map(r => r.data) });
  } catch (error) {
      console.error('Error calling API:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
