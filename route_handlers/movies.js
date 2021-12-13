"use strict";

const axios = require("axios");
let cache = require('../cache.js')

const url = 'https://api.themoviedb.org/3/search/movie';

const resetDuration = 86400000; // 24 hours
const fullResetDuration =  604800000; // one week


class MovieInfo {
    constructor(data){
        this.title = data.title;
        this.overview = data.overview;
        this.averageVotes = data.vote_average;
        this.totalVotes = data.vote_count;
        this.imageUrl = data.poster_path;
        this.popularity = data.popularity;
        this.releasedOn = data.release_date;
    }
}

async function handleMovie(req, res) {

    //set key
    const key = 'movie-' + req.query.searchQuery;
    console.log("movie request for: ", req.query.searchQuery);

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
        const movieResponse = await axios.get(`${url}?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`);
        let movieArray = movieResponse.data.results.map(data => new MovieInfo(data));
        cache[key] = movieArray;
        cache[key].timestamp = Date.now();
        res.status(200).send(movieArray);
    } 
    catch (error) {
        console.log('movie error')
        res.sendStatus(500);
        return
    }
}

module.exports = handleMovie;