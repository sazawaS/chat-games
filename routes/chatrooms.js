const express = require("express")
const router = express.Router()

const User = require("../models/user")
const Room = require("../models/room")
const Message = require("../models/message")

const utils = require("../modules/Utils")
const globals = require("../modules/globals")

function checkUserInRoom(room, userId) {
  var memberIdList = []
  room.members.forEach(member => {
    memberIdList.push(member.id)
  }) 
  if (memberIdList.includes(userId)) {
    return true;
  }
  return false;
} 

async function sendServerMessage(room, message) {

  try {

    const date = new Date()
    const newMessage = new Message({
      username: "[SERVER]",
      text:message,
      time: date.getTime(),
      pfp: "",
    })

    await newMessage.save()
    room.messages.push(newMessage)
    await room.save()
    globals.getGlobals("io").to(room.id).emit('newRoomMessage', newMessage);

  } catch (err) {
    console.error(err)
  }
}

globals.getGlobals("io").on("connection", (socket) => {

  /*
  socket.on("readyClient", async (req) => {
    try {
      const user = await User.find({username: req.username, password:req.password})
      if (user[0] !== undefined) {
        user[0].socketId = socket.id;
        await user[0].save();
      }
    } catch (err) {
      console.log('err happened in readying client', err, req)
    }
  })
  */

  socket.on("joinRoom", async (req) => {

    try {
      const room = await Room.model.findById(req.roomId).populate('messages').populate('members')
      const user = await User.find({username: req.username})

      if (room == undefined) {
        console.log("incorrect room")
        return;
      } 

      if (checkUserInRoom(room, user[0].id)) {
        socket.join(req.roomId)
        globals.getGlobals("io").to(socket.id).emit("letterUpdate", room.lettersData.get(user[0].id))
        sendServerMessage(room, req.username + " has joined the room.")
      }

    } catch (err) {
      console.log(err)
    }

  })

  socket.on("leaveRoom", async (req) => {

    try {
      const room = await Room.model.findById(req.roomId).populate('messages').populate('members').populate('owner')
      const user = await User.find({username: req.username})

      if (room == undefined) {
        console.log("incorrect room")
        return;
      } 

      if (checkUserInRoom(room, user[0].id)) {
        socket.leave(req.roomId)
        room.members.splice( room.members.indexOf(user[0]), 1)
        await room.save();
        sendServerMessage(room, req.username + " has left the room.")

        if (user[0].id == room.owner.id) {
          globals.getGlobals("io").to(room.id).emit('deleteRoom', req.username)
          await Room.model.findByIdAndDelete(room.id)
        }
      }

    } catch (err) {
      console.log(err)
    }

  })
})


router.get("/:id", async (req,res) =>{

  const id = req.params.id;
  try {
    const room = await Room.model.findById(id).populate("messages").populate('members').populate('owner')

    if (req.session.user !== undefined) {
      const user = await User.find({username: req.session.user.username})

      if (checkUserInRoom(room, user[0].id)) {

        if (room.owner.id == user[0].id) {
          res.render("chatroom", {messages:room.messages, myName:req.session.user.username, owner:true})
        }

        if (room.lettersData.get(user[0].id) == null) {
          const newLetter = createRandomLetter();
          room.lettersData.set(user[0].id, newLetter)
          await room.save()
        }

        res.render("chatroom", {messages:room.messages, myName:req.session.user.username, owner:false})
        return;
      }
      res.redirect("/join/rooms")
      return;
    }
    res.redirect("/join")
    
  } catch(err) {
    console.error(err)
  }
})

router.post('/:id', async (req, res) => {

  const id = req.params.id;
  try {

    const room = await Room.model.findById(id).populate("messages").populate('members')
    const user = await User.find({username: req.session.user.username})

    const date = new Date()
    if (user[0] !== undefined && checkUserInRoom(room, user[0].id)) {
      const newMessage = new Message({
        username  : req.session.user.username,
        letter    : room.lettersData.get(user[0].id),
        text      : req.body.text,
        time      : date.getTime(),
        pfp       : user[0].pfp,
      })
      await newMessage.save()
      room.messages.push(newMessage)
      await room.save()

      req.io.to(id).emit('newRoomMessage', newMessage);

    } else {
      
    }
  
  } catch (error) {
    console.error("failed sending new message", error)
  }
})


router.delete( ":/id", async (req,res) => {
  const id = req.params.id;
  try {
    await Room.model.findByIdAndDelete(id);
    res.redirect("/join/rooms")
  } catch (err) {
    console.error(err)
  }
  
});


function createRandomLetter() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

module.exports = router;