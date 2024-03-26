// db.mjs
import mongoose from 'mongoose';

// my schema goes here!
const Movie = new mongoose.Schema({
    title: String,
    director: String,
    year: Number
});

mongoose.model('Movie', Movie);

mongoose.connect(process.env.DSN);