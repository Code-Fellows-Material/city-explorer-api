"use strict";

const axios = require('axios');
const url = 'http://api.weatherbit.io/v2.0/forecast/daily';

class ForeCast {
    constructor(data) {
        this.date = data.datetime;
        this.description = `a high of ${data.max_temp}, a low of ${data.low_temp}, with ${data.weather.description}`;
    }
}

async function handleWeather(req, res) {
    console.log("weather request:", req.query.lat, req.query.lon);
    try {
        const weatherResponse = await axios.get(`${url}?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`);
        let forecastArr = weatherResponse.data.data.map(data => new ForeCast(data));
        res.status(200).send(forecastArr);
    } catch (error) {
        console.log('city error')
        res.sendStatus(500);
        return
    }
}

module.exports = handleWeather;