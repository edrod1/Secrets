//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

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

          // encryption package for userSchema
                                                                            //field
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });

});







app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
});



} //mongoose connection
