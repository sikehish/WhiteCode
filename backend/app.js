//Imports
const express = require('express')
const cors = require("cors");
const app = express()

//Middlewares
app.use(express.json())
app.use(cors())

//Routes
app.get('/', function (req, res) {
  res.send('Simple Example of routes!');
})

app.get('/signup', function (req, res) {
  res.send('This is demo route for sign up');
})

app.get('/signin', function (req, res) {
  res.send('This is demo route for sign in');
})

app.get('/signin/dashboard', function (req, res) {
  res.send('This is demo route for user who signed in and now reaches their dashboard');
})


module.exports=app
