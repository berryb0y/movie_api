const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    uuid = require('uuid'),
    path = require('path');

const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(morgan('common'));

// Logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// Get Requests

app.get('/', (req, res) => {
    res.send('Its not about how much we lost; Its about how much we have left. -Tony Stark. AVENGERS:ENDGAME')
});
    // get single user
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});//Works!    

    // get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});//Works!    

    // returns documentation
app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + 'public/documentation.html', { root: __dirname});
});

    // view all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
});//Works!

    // view single movie
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error ' + err);
    });
});//Works!


    // get favorites list
app.get('/users/:username/movies', (req, res) => {
    'pull up users favorites list' 
}); //not necessary because it is already pulled with their user information



    // view single director
app.get('/directors/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name})
    .then((movie) => {
        if(movie) {
            res.status(200).send(movie.Director.Bio);
        } else {
            res.status(400).send('Director not found.');
        };
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error ' + err);
    });
});//Works!


    // view single genre
app.get('/genre/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
        if(movie) { 
            res.status(200).json(movie.Genre.Description);
    } else{
      res.status(400).send('Genre not found.');
    };
    })  
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + error);
    });
});//Works!

    // view single actor
app.get('/actors/:Name', (req, res) => {
    res.send('Successful GET request returning data about a single actor');
}); //Will make in future

// other requests

    // register page for users
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});// does not work yet



    // add one to favorites list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
}); //Works!

    // allow user to remove favorite
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
    { $pull: {FavoriteMovies: req.params.MovieID }},
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error " + err);
        } else {
            res.status(200).json(updatedUser);
        }
    });
});//Works!

    // allow user to delete profile
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username})
    .then ((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.'); 
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
}); //needs to be tested


    // allow users to update profile
app.put('/profile/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});// does not work


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