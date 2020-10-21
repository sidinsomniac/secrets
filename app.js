//jshint esversion:6
require('dotenv').config();
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');


const port = 3000;
const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: '7SFD87S6SXJ9G3',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect('/secrets');
                });
            }
        });
    });


app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect('/secrets');
                });
            }
        });
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.listen(process.env.PORT || port, () => {
    console.log("Server has started");
});