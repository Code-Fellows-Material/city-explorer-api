"use strict";

const axios = require("axios");
const cache = require('../cache.js')

const url = 'https://api.themoviedb.org/3/search/movie';

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
    const key = 'movie-' + req.query.searchQuery;

    console.log("movie request for: ", req.query.searchQuery);

    if (cache[key]) {
        console.log('cache hit on', key)
        res.status(200).send(cache[key])
        return
    }
    console.log('cache miss on', key)

    try {
        const movieResponse = await axios.get(`${url}?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`);
        let movieArray = movieResponse.data.results.map(data => new MovieInfo(data));
        cache[key] = movieArray;
        res.status(200).send(movieArray);
    } 
    catch (error) {
        console.log('movie error')
        res.sendStatus(500);
        return
    }
}

module.exports = handleMovie;