//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Dog named Wally.",
  resave: false,
  saveUninitialized: false
}));

//manage session
app.use(passport.initialize());
app.use(passport.session());

// Run main function and catch error
main().catch((err) => console.log(err));
// async function
async function main() {

  const url = 'mongodb://127.0.0.1:27017';
  const dbPath = "/userDB";
  await mongoose.connect(url + dbPath);
  //{useNewUrlParser: true} //(no longer necessary)avoids depreciation warning


const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.render("/login");
  }
});

  app.get('/logout', function(req, res) {
  req.logout(function(err) {
      if (err) {
        console.log(err);
      } else {
          res.redirect('/');
      }
  });
});

app.post("/register", function(req, res){

User.register({username: req.body.username}, req.body.password, function(err, user){
  if (err) {
    console.log(err);
    res.redirect("/register");
  } else {
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secrets");
    });
  }
});

});

  app.post("/login", function(req, res){

  const user = User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});







app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
});



} //mongoose connection
