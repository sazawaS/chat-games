const express = require("express")
const router = express.Router()

const User = require('../models/user')

router.get("/", (req, res) => {
  res.render('register')
})


router.post("/", async (req, res) => {

  //Username check
  try {
    const check1 = await User.find({username: req.body.username});
    if (check1[0]) {
      res.render('register', {errorMessage: "Username already in use!"})
      console.log('yo')
      return
    }
  } catch(err) {
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
    const user = User({
      username: req.body.username,
      email   : req.body.email,
      password: req.body.password,
    })

    await user.save()
    console.log(user)
  } catch {
    console.log("Failed")
  }
})


module.exports = router;