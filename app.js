//jshint esversion:6
const ejs = require('ejs');
const md5 = require('md5');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const port = 3000;
const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);


app.get('/', (req, res) => {
    res.render('home');
});


app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        User.findOne({ email: req.body.username }, (err, foundUser) => {
            if (foundUser) {
                if (foundUser.password === md5(req.body.password)) {
                    res.render('secrets');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.send(err);
            }
        });
    });


app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save(err => {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });


app.listen(process.env.PORT || port, () => {
    console.log("Server has started");
});