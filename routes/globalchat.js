const express = require("express")
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')


//See all messages
router.get('/',checkUser, async (req, res) => {

  const date = new Date()
  const currentTime = date.getTime()

  try {
    
    const messages = await Message.find({ time: { $gt: currentTime-60000 } })
    if (req.session.user ) {
      res.render("globalchat", {messages:messages, myName:req.session.user.username})
      return;
    }
    res.render("globalchat", {messages:messages})

  } catch {
    console.error("failed getting all messages")
  }
})

//Make new message
router.post('/',checkUser, async (req, res) => {

  const date = new Date()
  try {


    const user = await User.find({username: req.session.user.username})

    if (user[0]) {
      const newMessage = new Message({
        username: req.session.user.username,
        text:req.body.text,
        time: date.getTime(),
        pfp: user[0].pfp,
      })
      await newMessage.save()
      req.io.emit('newMessage', newMessage);

    }
  
  } catch (error) {
    console.error("failed sending new message", error)
  }
})


//Middleware to see if user is logged in or not.
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