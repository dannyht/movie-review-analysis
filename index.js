const PORT = process.env.PORT || 3000 // this is for deploying on heroku
const express = require('express')
const axios = require('axios')
var cors = require('cors'); // use CORS to enable cross origin domain requests.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const app = express()

const movieList = require('./movies.json')

let movieListDetails = [];
let specificMovieDetails = []; 


const apiKey = '';
const omdbApiUrl = ''
const mongoDbpass = ''
const mongoDbConnectionString = ''


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
            //console.error(err)
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
    var savedata = new Model({
        'movie': movieListDetails,
        'time': Math.floor(Date.now() / 1000) // time of save the data in unix timestamp format
    }).save(function(err, result) {
        if (err) throw err;

        if(result) {
            res.json(result)
        }
    })
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))