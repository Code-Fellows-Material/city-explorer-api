"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

class MovieInfo {
    constructor(data){
        this.title = data.title;
        this.overview = data.overview;
        this.averageVotes = data.average_votes;
        this.totalVotes = data.total_votes;
        this.imageUrl = data.image_url;
        this.popularity = data.popularity;
        this.releasedOn = data.released_on;
    }
}

class ForeCast {
    constructor(data) {
        this.date = data.datetime;
        this.description = `a high of ${data.max_temp}, a low of ${data.low_temp}, with ${data.weather.description}`;
    }
}

// routes
app.get("/weather", handleWeather);
app.get("/movie", handleMovie);
app.get("/*", handleError);

//------------------Handler Functions-----------------------

//Handle Error Route
function handleError(req, res) {
    console.log("Error!");
    res.sendStatus(500);
}

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

async function handleMovie(req, res) {
    console.log("movie: ", req.query.searchQuery);
    try {
        const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`
        );
        let movieArray = [];
        for (let data of movieResponse.data.results) {
            movieArray.push(new MovieInfo(data));
        }
        res.status(200).send(movieArray);
    } 
    catch (error) {
        console.log('movie error')
        res.sendStatus(500);
        return
    }
}

app.listen(PORT, () => console.log("server is listening on port ", PORT));
