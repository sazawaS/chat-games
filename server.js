if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const app = express()

const joinRouter = require('./routes/join');
const gameroomRouter = require('./routes/gameroom');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.json())

app.get("/", (req, res) => {
  res.render('index')
})

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error)); 
db.once('open', () => console.log("Database connection success"))

app.use("/join", joinRouter)
app.use("/gameroom", gameroomRouter)

app.listen(process.env.PORT || 3000);