const express = require("express")
const mongoose = require('mongoose')
const router = express.Router()

const Message = require("../models/message")

router.get('/', (req, res) => {
  res.render('username')
})
router.post('/', async (req, res) => {

  console.log(req.body)

  const joinMessage = new Message({
    username: req.body.username,
    text: req.body.username + " has joined the game!"
  })
  try {
    await joinMessage.save();
    res.render('gameroom');
  } catch {
    console.error('failed saving new message')
  }

  console.log(req.body)
})

module.exports = router;