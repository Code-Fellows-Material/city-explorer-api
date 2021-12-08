"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const list = require("./data/weather.json");
const app = express();
const PORT = process.env.PORT;

app.use(cors());

class ForeCast {
    constructor(date, description){
        this.date = date,
        this.description = description
    }
}

// routes
app.get("/weather", handleWeather);
app.get("/*", handleError);

//Sara requested we save lat and lon until tomorrow, so weather requests will be by name only.
function handleWeather(req, res) {
    console.log('received weather request for:', req.query.searchQuery);
    // check searchQuery against known cities, send error status if no match.
    let knownCities = ['seattle', 'paris', 'amman']
    let searchQuery = req.query.searchQuery.toLowerCase();
    if(knownCities.indexOf(searchQuery) === -1){
        console.log('city error')
        res.sendStatus(500);
        return
    };
    //Find the requested city, then find the forecast for that city and save it to an array
    let city = list.find(element => element.city_name.toLowerCase() === searchQuery);
    let forecastArr = [];
    for(let data of city.data){
        forecastArr.push( new ForeCast(data.datetime, data.weather.description));
    }
    //turn the forecast array into JSON string and send the array back to the client
    res.status(200).send(JSON.stringify(forecastArr));
}

//Handle Error Route
function handleError(req, res) {
    console.log("Error!");
    res.sendStatus(500);
}

app.listen(PORT, () => console.log("server is listening on port ", PORT));
