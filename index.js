const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');


const app = express();
app.use(morgan('common'));

// Logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// first 10 marvel movies to come out in order
let topMovies = [
    {
        title: 'Iron Man',
        director: 'Jon Favreau'
    },
    {
        title: 'The Incredible Hulk',
        director: 'Louis Leterrier'
    },
    {
        title: 'Iron Man 2',
        director: 'Jon Favreau'
    },
    {
        title: 'Thor',
        director: 'Kenneth Branagh'
    },
    {
        title: 'Captain America: The First Avenger',
        director: 'Joe Johnston'
    },
    {
        title: 'The Avengers',
        director: 'Joss Whedon'
    },
    {
        title: 'Iron Man 3',
        director: 'Shane Black'
    },
    {
        title: 'Thor: The Dark World',
        director: 'Alan Taylor'
    },
    {
        title: 'Captain America: The Winter Soldier',
        director: 'Anthony Russo, Joe Russo'
    },
    {
        title: 'Gaurdians of the Galaxy',
        director: 'James Gunn'
    }
];

// Get Requests

app.get('/', (req, res) => {
    res.send('Its not about how much we lost; Its about how much we have left. -Tony Starl. AVENGERS:ENDGAME')
});

app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + 'public/documentation.html', { root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});





// middleware -static, error handling,
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something is broken here');
});

app.listen(8081, () => {
    console.log('Your app is listening on port 8080.');
});