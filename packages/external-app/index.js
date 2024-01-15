const express = require("express");
const axios = require("axios");

const app = express();
const port = 3002;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/", async (req, res) => {
  console.log("Received request", req.body);

  // Dispatch between 2 to 5 requests
  console.log("Dispatching requests");
  const requestsCount = STATUS_LIST.length;
  for (let i = 0; i < requestsCount; i++) {
    console.log("Dispatching request :", i);
    await createDelay();
    axios
      .post(req.body.url, {
        uuid: req.body.uuid,
        status: STATUS_LIST[i],
      })
      .catch((err) => {
        console.log("Error while dispatching request");
      });
  }

  console.log("Requests dispatched");
  res.send("Requests dispatched");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/*
  Wait between 100ms and 3s
*/
async function createDelay() {
  const delay = Math.random() * (5000 - 100) + 200;
  console.log("Delay :", delay)
  await new Promise((resolve) => setTimeout(resolve, delay));
}

const STATUS_LIST = [
  "Recived",
  "Waiting",
  "Processing",
  "Processed",
  "Delivered",
  "Finish"
];