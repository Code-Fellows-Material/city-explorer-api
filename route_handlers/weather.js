"use strict";

const axios = require('axios');
let cache = require('../cache.js')

const url = 'http://api.weatherbit.io/v2.0/forecast/daily';

const resetDuration = 3600000; // 1 hour
const fullResetDuration =  604800000; // one week

class ForeCast {
    constructor(data) {
        this.date = data.datetime;
        this.description = `a high of ${data.max_temp}, a low of ${data.low_temp}, with ${data.weather.description}`;
    }
}


async function handleWeather(req, res) {

    //set key
    const key = 'weather-' + req.query.lat + req.query.lon;
    console.log("weather request for:", req.query.lat, req.query.lon);

    //check if full reset is required
    if (Object.keys(cache).length === 0 || (Date.now() - cache.timestamp > fullResetDuration)) {
        console.log('full reset triggered');
        cache = {};
        cache.timestamp = Date.now();
    }

    //check if there is a cache match and that the data is not stale
    if (cache[key] && (Date.now() - cache[key].timestamp < resetDuration)) {
        console.log('cache hit on', key)
        res.status(200).send(cache[key])
        return
    }

    //clean cache[key] on a miss
    console.log('cache miss on', key)
    cache[key] = {};


    // request data, add to cache and note time, and respond to request with formatted data if successful
    try {
        const weatherResponse = await axios.get(`${url}?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`);
        let forecastArr = weatherResponse.data.data.map(data => new ForeCast(data));
        cache[key] = forecastArr;
        cache[key].timestamp = Date.now();
        res.status(200).send(forecastArr);
    } catch (error) {
        console.log('city error')
        res.sendStatus(500);
        return
    }
}

module.exports = handleWeather;