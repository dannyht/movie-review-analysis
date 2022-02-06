const PORT = process.env.PORT || 3000 // this is for deploying on heroku
const express = require('express')
const axios = require('axios')
const app = express()


const apiKey = '38f4133e';
const omdbApiUrl = 'http://www.omdbapi.com/?apikey='
const movieName = 'A+Beautiful+Mind'

app.get('/', (req, res) => {
    res.json('Welcome to my Movie Review Analysis API')
})

app.get('/omdb', (req, res) => {
    // const movieId = req.params.movieId

    axios.get(omdbApiUrl + apiKey + '&t=' + movieName + '&plot=full')
    .then(response => {
        res.json(response.data)
    })
    .catch(err => res.json(err))
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))