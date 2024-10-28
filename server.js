if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const app = express()
const ejs = require('ejs')
const session = require('cookie-session')
const mongoose = require('mongoose')


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

app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.render('index', {myName: req.session.user.username})
})

app.get("/logout", (req, res) => {
  req.session.user = {};
  res.redirect("/")
})

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error)); 
db.once('open', () => console.log("Database connection success"))

const server = app.listen(process.env.PORT || 8080);
const io = require('socket.io')(server);
io.on("connection", socket => {
})

app.use("/join", joinRouter)
app.use("/register", registerRouter)
app.use("/gameroom", gameroomRouter)
