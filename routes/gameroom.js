const express = require("express")
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')


//See all messages
router.get('/',checkUser, async (req, res) => {

  try {
    const messages = await Message.find({})
    res.render("gameroom", {messages:messages})

  } catch {
    console.error("failed getting all messages")
  }
})

//Make new message
router.post('/',checkUser, async (req, res) => {


  try {
    const newMessage = new Message({
      username: req.session.user.username,
      text:req.body.text
    })
    newMessage.save()
    console.log(newMessage.id)
    try {
      const messages = await Message.find({})
      res.render("gameroom", {messages:messages})
    } catch {
      console.error("failed getting all messages")
    }
  } catch {
    console.error("failed sending new message")
  }
})


function filterOrdersByTime() {

}

//Middle ware to see if user is logged in or not.
async function checkUser (req, res, next) {

  if (req.session.user) {
    if (req.session.user.username) {
      next() 
      return;
    }
  } 
  res.redirect('/join')
}


module.exports = router;