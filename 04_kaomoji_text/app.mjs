// app.mjs
import express from 'express';
import { Kaomoji } from './kaomoji.mjs';
import { readFile } from 'fs';

const app = express();
const emotions = [];

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    console.log('Method: ', req.method);
    console.log('Path: ', req.path);
    console.log(req.query);
    next();
});

app.get('/', (req, res) => {
    res.redirect('/editor');
});

app.get('/editor', (req, res) => {
    res.render('editor');
});

app.post('/editor', (req, res) => {
    let translation = req.body.text.split(' ');
    translation = translation.map((word) => {
        for (const kaomoji of emotions) {
            if (kaomoji.isEmotion(word.toLowerCase())) {
                return kaomoji.value;
            }
        }
        return word;
    });
    translation = translation.join(' ');
    res.render('editor', {original: req.body.text, translated: translation});
});

app.get('/dictionary', (req, res) => {
    if (req.query.emotion) {
        const filtered = emotions.filter((kaomoji) => kaomoji.isEmotion(req.query.emotion));
        res.render('dictionary', {emotions: filtered});
    }
    else {
        res.render('dictionary', {emotions: emotions});
    }
});

app.post('/dictionary', (req, res) => {
    emotions.push(new Kaomoji(req.body.new_value, req.body.new_emotions.toLowerCase().split(',')));
    res.redirect('/dictionary');
    // console.log(emotions);
});

readFile('./code-samples/kaomojiData.json', 'utf-8', (err, data) => {
    JSON.parse(data).forEach((kaomoji) => {
        emotions.push(new Kaomoji(kaomoji.value, kaomoji.emotions));
    });
    console.log(emotions);
    app.listen(3000, () => {
        console.log("Server started; type CTRL+C to shut down");
    });
});