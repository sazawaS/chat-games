const express = require('express')
const route = express.Router()
const path = require("path")
const fs = require('fs')

const User = require('../models/user')
const upload = require('../modules/uploadPFP')

//Redirect to user's profile
route.get("/me", (req, res) => {
  if (req.session.user == undefined || req.session.user.username == undefined ) {
    res.redirect("/join")
    return
  }
  res.redirect("/users/"+ req.session.user.username )
}) 

route.get('/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const user = await User.find({username:name})
    if (user[0] == undefined) {
      res.redirect("/join")
    } else {

      const MY = (Date.now() - user[0].creationDate);
      const days = Math.floor(MY / (1000 * 60 * 60 * 24));
      const hrs = Math.floor( (MY / (1000 * 60 * 60)) - (days/24) ) 
      const min = Math.floor( (MY / (1000 * 60)) - (hrs/60) )   
      
      const data = {
        username      : user[0].username,
        email         : user[0].email,
        creationDate  : days + " days ago, " + hrs  + " hours ago, " + min + " minutes ago.",
        pfp           : user[0].pfp
      }

      const bool = user[0].username === req.session.user.username
      res.render('userprofile', { user: data, myName:req.session.user.username , CanEdit:bool})
    }
  } catch {

  }

}) 

route.post('/me', upload.single('file'), async (req, res) => {

  if (req.file == undefined) {
    return;
  }

  fs.rename(req.file.path, "public\\uploads\\"+req.body.username+ "-PFP" + path.extname(req.file.originalname), (err) => {
    if (err) throw err;
  })

  var link = ""
  if (process.env.NODE_ENV == 'production') {
    link = "https://chat-games.onrender.com/uploads/" 
  } else {
    link = "http://localhost:3000/uploads/"
  }
  link = link + req.body.username+ "-PFP" + path.extname(req.file.originalname);

  try {
  await User.updateOne({username: req.body.username}, {
    pfp: link
  }) 
    

    console.log(link)
    res.send({newImg: link})
  } catch (err) {
    console.log(err)
  }
})

module.exports = route;