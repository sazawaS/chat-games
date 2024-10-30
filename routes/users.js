const express = require('express')
const route = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require('fs')

const User = require('../models/user')


const storage = multer.diskStorage({
  destination: function ( req, file, cb ) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb ) {
    const uniqueSuffix = req.body.username + '-PFP';
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,
  limits: {fileSize	:1000000}, 
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== '.gif') {
      return cb(new Error("Only images are allowed."))
    }
    cb(null, true)
  }
})

route.get('/me', async (req,res) => {

  if (req.session.user.username == undefined ) {
    res.redirect("/login")
  }

  try {
    const user = await User.find( {username: req.session.user.username} )

    const MY = (Date.now() - user[0].creationDate);
    const min = Math.floor(MY/ (1000 * 60) );
    const hr = Math.floor(min/ 60);
    const days = Math.floor(hr/24);

    

    const data = {
      username      : user[0].username,
      email         : user[0].email,
      creationDate  : days + " days ago, " + hr + " hours ago, " + min + " minutes ago.",
      pfp           : user[0].pfp
    }

    res.render('userMyself', { user: data, myName:req.session.user.username })

  } catch {

  }
})

route.post('/me', upload.single('file'), async (req, res) => {

  fs.rename(req.file.path, "public\\uploads\\"+req.body.username+ "-PFP" + path.extname(req.file.originalname), (err) => {
    if (err) throw err;
  })

  var link = ""
  if (process.env.NODE_ENV == 'production') {
    link = "https://chat-games.onrender.com/uploads/" 
  } else {
    link = "http://localhost:8080/uploads/"
  }
  link = link + req.body.username+ "-PFP" + path.extname(req.file.originalname);

  try {
    const user = await User.find({username: req.body.username})
    user[0].pfp = link;

    console.log(link)

  } catch (err) {
    console.log(err)
  }
})

module.exports = route;