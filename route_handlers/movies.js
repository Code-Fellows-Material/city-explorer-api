"use strict";
const axios = require("axios");
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
    console.log("movie: ", req.query.searchQuery);
    try {
        const movieResponse = await axios.get(`${url}?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`);
        let movieArray = movieResponse.data.results.map(data => new MovieInfo(data));
        res.status(200).send(movieArray);
    } 
    catch (error) {
        console.log('movie error')
        res.sendStatus(500);
        return
    }
}

module.exports = handleMovie;