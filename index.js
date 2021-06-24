const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post("/seruni", async (req, res) => {
  try {
    if (req.body.token) {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      };
      if (req.body.method == "post") {
        const response = await axios.post(
          req.body.url,
          req.body.request,
          axiosConfig
        );
        res.send(response.data);
      } else {
        const response = await axios.get(req.body.url, axiosConfig);
        res.send(response.data);
      }
    } else {
      if (req.body.method == "post") {
        const response = await axios.post(req.body.url, req.body.request);
        res.send(response.data);
      } else {
        const response = await axios.get(req.body.url);
        res.send(response.data);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, "0.0.0.0");
