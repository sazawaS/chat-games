const express = require("express")
const router = express.Router()
const path = require('path')

const User = require('../models/user')
const upload = require('../modules/uploadPFP')


router.get("/", (req, res) => {

  if ( req.session.user !== undefined && req.session.user.username !== undefined ) {
    res.redirect('/gameroom')
    return;
  }
  res.render('register')
})




//Create account
router.post("/", upload.single('avatar'), async (req, res) => {

  
  //Username check
  try {
    const check1 = await User.find({username: req.body.username});
    if (check1[0]) {
      res.render('register', {errorMessage: "Username already in use!"})
      return
    }

    var letters = /^[0-9a-zA-Z]+$/;
    if (!letters.test(req.body.username) || req.body.username.length < 3 || req.body.username.length > 20) {
      res.render('register', {warnMessage: "Username is too long or too short!"})
    }

  } catch(err) {
    console.log(err)
    res.render('register')
    return
  }

  //Email check
  try {
    const check2 = await User.find({email: req.body.email});
    if (check2[0]) {
      res.render('register', {errorMessage: "Email already in use!"})
      return
    }
  } catch {
    res.render('register')
    return
  }


  try {
    var link = ""

    if (req.file == undefined) {
      link = "http://localhost:3000/assets/DefaultPFP.jpg"
    } else {
      if (process.env.NODE_ENV == 'production') {
        link = "https://chat-games.onrender.com/uploads/" 
      } else {
        link = "http://localhost:3000/uploads/"
      }
      link = link +  req.body.username + '-PFP' + path.extname(req.file.filename);
    }


    console.log(link)

    const user = User({
      username      : req.body.username,
      email         : req.body.email,
      password      : req.body.password,
      creationDate  : Date.now(),
      pfp           : link,
    })


    await user.save()
    res.redirect("/join")

  } catch (err) {
    console.error("Failed creating new user!", err)
  }
})






module.exports = router;