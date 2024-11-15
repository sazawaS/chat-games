if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const app = express()
const ejs = require('ejs')
const session = require('cookie-session')
const mongoose = require('mongoose')
<<<<<<< HEAD


const users = require('./routes/users');
const joinRouter = require('./routes/join');
const registerRouter = require('./routes/register');
const gameroomRouter = require('./routes/gameroom');
=======
const globals = require('./modules/globals')

const User = require('./models/user')
>>>>>>> master

app.set('view engine', 'ejs');
app.use(express.static('public'))
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
  if (req.session.user ) {
    res.render('index', {myName: req.session.user.username})
    return;
  }
  res.render('index')
})

<<<<<<< HEAD
app.get("/logout", (req, res) => {
  console.log("Logging out " + req.session.user.username)
=======
app.get("/logout", async (req, res) => {

  try {
    const user = await User.find({username: req.session.user.username})
    if (user[0] !== undefined) {
      user[0].socketId = "";
      await user[0].save();
      console.log('socket id reset!')
    }
    
  } catch (err) {
    console.log('err happened in unreadying client')
  }

>>>>>>> master
  req.session.user = {};
  res.redirect("/")
})

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error)); 
db.once('open', () => console.log("Database connection success"))

const server = app.listen(process.env.PORT || 3000);
const io = require('socket.io')(server);
<<<<<<< HEAD
io.on("connection", socket => {
})

app.use("/join", joinRouter)
app.use("/register", registerRouter)
app.use("/gameroom", gameroomRouter)
app.use("/users", users)

=======
globals.setGlobals("io", io)


const users = require('./routes/users');
const joinRouter = require('./routes/join');
const registerRouter = require('./routes/register');
const chatRoomRouter = require('./routes/chatrooms');
const globalchatRouter = require('./routes/globalchat');

app.use("/join", joinRouter)
app.use("/register", registerRouter)
app.use("/globalchat", globalchatRouter)
app.use("/users", users)
app.use("/rooms", chatRoomRouter)
>>>>>>> master
