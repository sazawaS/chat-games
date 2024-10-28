const express = require("express")
const router = express.Router()
const session = require('express-session');


const User = require("../models/user")
const Message = require("../models/message")

router.get('/', (req, res) => {
  
  if (req.session.user && req.session.user.username) {
    console.log('is logged in!')
    res.redirect("/gameroom")
    return;
  }
  res.render('login')
})


router.post('/', async (req, res) => {


  try {
    const user = await User.find({
      username: req.body.username,
      password: req.body.password 
    })
    
    if (user[0].id == null) {
      res.render('login', { errorMessage: 'Wrong password or username! Dont have an account?'})
    } else {
      req.session.user = { id:user.id, username: req.body.username };
      res.redirect('/gameroom')
    }
  } catch { 
    res.render('login', { errorMessage: 'Wrong password or username! Dont have an account?'})
  }

})

module.exports = router;