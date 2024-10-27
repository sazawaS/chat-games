const express = require("express")
const router = express.Router()

const Message = require('../models/message')


//See all messages
router.get('/', async (req, res) => {
  Message.deleteMany({});
  try {
    const messages = await Message.find({})
    res.render("gameroom", {messages:messages})

  } catch {
    console.error("failed getting all messages")
  }
})

//Make new message
router.post('/', async (req, res) => {


  try {
    const newMessage = new Message({
      username:req.body.username,
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


module.exports = router;