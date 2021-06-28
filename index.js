const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { response } = require("express");
const cryptoJs = require("crypto-js");
const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post("/seruni", async (req, res) => {
  try {
    if (req.body.token) {
      let axiosConfig = {
        headers: {
          Date: new Date().toUTCString(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.body.token}`,
        },
      };
      if (req.body.method == "post") {
        console.log(res.body.request)
        const response = await axios.post(
          req.body.url,
          req.body.request,
          axiosConfig
        );
        console.log(res.body.request)
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
    res.send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);
    let axiosConfig = {
      headers: {
        Date: new Date().toUTCString(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${response.data.token}`,
      },
    };
    let result = req.body.request.username.concat(req.body.request.password);
    result = cryptoJs.MD5(result).toString();
    result = response.data.token.concat(result);
    result = cryptoJs.MD5(result).toString().toUpperCase();
    let request = {
      username: req.body.request.username,
      password: result,
    };

    const login = await axios.post(req.body.url, request, axiosConfig);

    res.send({ session: response.data, login: login.data});
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, "0.0.0.0");
