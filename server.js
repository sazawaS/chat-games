if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session');

const joinRouter = require('./routes/join');
const registerRouter = require('./routes/register');
const gameroomRouter = require('./routes/gameroom');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.get("/", (req, res) => {
  res.render('index')

  //If player is in homepage, destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('Session destroyed');
    }
  })
})

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error)); 
db.once('open', () => console.log("Database connection success"))

app.use("/join", joinRouter)
app.use("/register", registerRouter)
app.use("/gameroom", gameroomRouter)

app.listen(process.env.PORT || 3000);