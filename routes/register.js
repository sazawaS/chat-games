const express = require("express")
const router = express.Router()
const multer = require('multer')
const path = require('path')

const User = require('../models/user')

router.get("/", (req, res) => {
  if (req.session.user ) {
    res.redirect('/gameroom')
    return;
  }
  res.render('register')
})



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
    if (!letters.test(req.body.username)) {
      res.render('register')
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
    var link = "http://localhost:"
    if (process.env.PORT) {
      link = link + process.env.PORT + "/uploads/"
    } else {
      link = link + "8080/uploads/"
    }

    console.log(link)
    const user = User({
      username: req.body.username,
      email   : req.body.email,
      password: req.body.password,
      pfp     : link + req.body.username + '-PFP' + path.extname(req.file.filename),
    })


    await user.save()
    res.redirect("/join")

  } catch {
    console.error("Failed creating new user!")
  }
})






module.exports = router;