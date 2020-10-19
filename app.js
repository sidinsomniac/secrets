//jshint esversion:6
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.listen(process.env.PORT || port, () => {
    console.log("Server has started");
});