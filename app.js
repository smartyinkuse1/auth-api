const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//const session = require('express-session');
dotenv.config()
const session = require('client-sessions');    

app.use(session({
  cookieName: 'sessioncookie',
  secret: process.env.KEY,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));



app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
//app.use(session({secret:process.env.KEY, cookie: { maxAge: 60000 }}))
require('./routes/route')(app)
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
}).then(()=>{
    console.log("Connected succesfully to the database")
}).catch(err =>{
    console.log("couldn't connect.. exiting", err);
    process.exit();
})

app.listen(4000, ()=>{
    console.log('server up on port 4000')
})