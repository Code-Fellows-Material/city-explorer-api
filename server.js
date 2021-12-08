"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const list = require("./data/weather.json");

const app = express();

app.use(cors());

const PORT = process.env.PORT;

// routes

app.get("/test", handTest);
app.get("/*", handleError);

function handleError(req, res) {
    console.log("Error!");
    res.sendStatus(500);
}

function handTest(req, res) {
    res.send("your test worked!");
}

app.listen(PORT, () => console.log("server is listening on port ", PORT));
