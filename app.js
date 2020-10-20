//jshint esversion:6
const ejs = require('ejs');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const port = 3000;
const app = express();
const saltRounds = 10;


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
                bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                    if (result) {
                        res.render('secrets');
                    } else {
                        res.redirect('/login');
                    }
                })
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

        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(err => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('secrets');
                }
            });
        })
    });


app.listen(process.env.PORT || port, () => {
    console.log("Server has started");
});