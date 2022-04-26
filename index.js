const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    uuid = require('uuid'),
    path = require('path');


const app = express();
app.use(morgan('common'));
r;

// Logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// users
let users = [
    {
        id: 1,
        name: 'Jake Bishop',
        username: 'Bishop123',
        password: 'Bishop321',
        email: 'Bishop123@gmail.com',
        birthday: '03/22/1999',
        favorites: []
    },
    {
        id: 2,
        name: 'Bella Dome',
        username: 'Bella123',
        password: 'Bella321',
        email: 'Bella123@gmail.com',
        birthday: '10/03/1998',
        favorites: []
    }
];

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
    res.send('Its not about how much we lost; Its about how much we have left. -Tony Stark. AVENGERS:ENDGAME')
});
    // view single user
app.get('/profile/:username', (req, res) => {
    users.findOne({ username: req.params.username})
        .then((user) => {
            res.json(user);
        })
});    
    // returns documentation
app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + 'public/documentation.html', { root: __dirname});
});
    // view all movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});
    // view single movie
app.get('/movies/:name', (req, res) => {
    res.send('Successful GET request returning data on a single movie');
});
    // view single director
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on a single director');
});
    // view single genre
app.get('/genres/:genre', (req, res) => {
    res.send('Successful GET request returning data about a single genre');
});
    // view single actor
app.get('/actors/:name', (req, res) => {
    res.send('Successful GET request returning data about a single actor');
});

// other requests

    // register page for users
app.post('/register', (req, res) => {
    res.send('Successful Post request returning data added for user');
});
    // favorites list
app.put('/profile/:username/:favorites', (req, res) => {
    'pull up users favorites list'
});
    // allow user to remove favorite
app.delete('/profile/:username/:favorites', (req, res) => {
    'function to delete favorite'
})
    // allow user to delete profile
app.delete('/profile/:username', (req, res) => {
    'function for user to delete profile.'
})
    // allow users to update profile
app.put('/profile/:username', (req, res) => {
    res.put('Successfully updated data on profile');
});


// middleware -static, error handling,
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something is broken here');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});