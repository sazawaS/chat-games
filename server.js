if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const app = express()

const gameRouter = require('./routes/gameroom');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
  res.render('index')
})

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error)); 
db.once('open', () => console.log("Database connection success"))

app.use("/gameroom", gameRouter)

app.listen(process.env.PORT || 3000);