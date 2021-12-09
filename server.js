"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const e = require("express");
const app = express();
const PORT = process.env.PORT;

app.use(cors());

class ForeCast {
    constructor(data) {
        this.date = data.datetime;
        this.description = `a high of ${data.max_temp}, a low of ${data.low_temp}, with ${data.weather.description}`;
    }
}

// routes
app.get("/weather", handleWeather);
// app.get("/location", handleLocation);
// app.get("/movie", handleMovie);
app.get("/*", handleError);

//------------------Handler Functions-----------------------

//Handle Error Route
function handleError(req, res) {
    console.log("Error!");
    res.sendStatus(500);
}

//--------------Helper Functions----------------------

async function handleWeather(req, res) {
    console.log("weather request:", req.query.lat, req.query.lon);
    try {
        const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`;
        const weatherResponse = await axios.get(url);
        let forecastArr = [];
        for (let data of weatherResponse.data.data) {
        forecastArr.push(new ForeCast(data));
        }
        res.status(200).send(forecastArr);
    } catch (error) {
        console.log('city error')
        res.sendStatus(500);
        return
    }
}

// async function handleLocation(req, res) {}

// async function handleMovie(req, res) {
//     console.log("location");
//     try {
//         const movieResponse = await axios.get(
//         `https://api.themoviedb.org/3/movie/76341?api_key=${process.env.MOVIE_API_KEY}`
//         );
//         res.status(200).send(movieResponse.data.data);
//         console.log(movieResponse.data.data);
//     } catch (error) {
//         console.log(error.response.data.error);
//     }
// }

app.listen(PORT, () => console.log("server is listening on port ", PORT));
