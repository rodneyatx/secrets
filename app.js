require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true});

const schema = new mongoose.Schema ({
  email: String,
  password: String
});

schema.plugin(encrypt, { secret: process.env.DB_KEY, encryptedFields: ['password']});
const User = new mongoose.model("User", schema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {

  User.findOne({email: req.body.username}, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      if (rows && rows.password === req.body.password) {
        console.log(rows.password);
          res.render('secrets');
      } else {
        console.log('Invalid password');
        res.send('Invalid Password.');
      }
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  console.log("Registering new user");

  const u = new User({
    email: req.body.username,
    password: req.body.password
  });
  u.save((err) => {

    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
