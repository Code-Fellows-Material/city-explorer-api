
//------------------Setup-----------------------
"use strict";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.options('*', cors());  

//------------------Change for Local-----------------------
const PORT = process.env.PORT;
// const PORT = 3001;

//------------------Modules-----------------------
const handleWeather = require('./route_handlers/weather');
const handleMovie = require('./route_handlers/movies');

//------------------Routes-----------------------
app.get("/weather", handleWeather);
app.get("/movies", handleMovie);
app.get("/*", handleError);

//------------------Error Handler-----------------------
function handleError(req, res) {
    console.log("Error!");
    res.sendStatus(500);
}

//------------------Listener-----------------------
app.listen(PORT, () => console.log("server is listening on port ", PORT));
