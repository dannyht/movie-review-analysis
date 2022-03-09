require('dotenv').config();

const PORT = process.env.PORT || 3000 // this is for deploying on heroku
const apiKey = process.env.API_KEY;
const omdbApiUrl = process.env.OMDB_API_URL;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING

const express = require('express')
const axios = require('axios')
var cors = require('cors'); // use CORS to enable cross origin domain requests.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const app = express()


// add a json file containing the titles of the movies you want to get more details about
const movieList = require('../resources/movies.json')

let movieListDetails = [];
let specificMovieDetails = []; 

var schemaName = new Schema({
    movie: Object,
    time: Number
}, {
    collection: 'movies'
});

var Model = mongoose.model('Model', schemaName);
mongoose.connect(mongoDbConnectionString);

movieList.forEach(movie => {
    axios.get(omdbApiUrl + apiKey + '&t=' + movie.title + '&plot=full')
        .then(response => {
            movieListDetails.push(response.data);
        })
        .catch(err => () => {
            console.error(err)
        })
    })


app.get('/', (req, res) => {
    res.json('Welcome to my Movie Review Analysis API')
})

app.get('/omdb/:movieId', (req, res) => {
    axios.get(omdbApiUrl + apiKey + '&t=' + req.params.movieId + '&plot=full')
        .then(response => {
            specificMovieDetails = response.data
            res.json(response.data)
        })
        .catch(err => res.json(err))
})

app.get('/omdb', (req, res) => {
    res.json(movieListDetails);
})

app.get('/omdb/save/all', cors(), function(req, res) {
    if (movieListDetails.length > 0) {
        movieListDetails.forEach(movie => {
            var savedata = new Model({
                'movie': movie,
                'time': Math.floor(Date.now() / 1000) // time of save the data in unix timestamp format
            }).save(function(err, result) {
                if (err) {
                    console.error(err);
                }
                if(result) {
                    console.info(result);
                }
            })
        });
    }
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))