import './config.mjs';
import './db.mjs';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
    secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false
};

app.use(session(sessionOptions));

const Movie = mongoose.model('Movie');

app.get('/movies', async (req, res) => {
    const query = {};
    if (req.query.director) {
        query.director = req.query.director;
    }
    try {
        query.movies = await Movie.find(query);
    }
    catch (e) {
        res.status(500).send();
    }
    res.render('movies', query);
});

app.get('/movies/add', (req, res) => {
    res.render('movies_add');
});

app.post('/movies/add', async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
    }
    catch (e) {
        res.status(500).send();
    }
    if (!req.session.movies) {
        req.session.movies = [];
    }
    req.session.movies.push(req.body);
    res.redirect('/movies');
});

app.get('/mymovies', async (req, res) => {
    res.render('mymovies', {movies: req.session.movies});
});

app.listen(process.env.PORT ?? 3000);
