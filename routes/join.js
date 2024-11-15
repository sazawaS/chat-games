const express = require("express")
const router = express.Router()
const session = require('express-session');


const User = require("../models/user")
<<<<<<< HEAD
const Message = require("../models/message")
=======
const Room = require("../models/room")
const utils = require("../modules/Utils")
>>>>>>> master

router.get('/', (req, res) => {
  
  if (req.session.user && req.session.user.username) {
<<<<<<< HEAD
    res.redirect("/gameroom")
=======
    res.redirect("join/rooms")
>>>>>>> master
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
<<<<<<< HEAD
      res.redirect('/gameroom')
=======
      res.redirect('join/rooms')
>>>>>>> master
    }
  } catch { 
    res.render('login', { errorMessage: 'Wrong password or username! Dont have an account?'})
  }

})

<<<<<<< HEAD
=======

//Rooms
router.get('/rooms', async (req, res)=> {

  if (req.session.user == undefined || req.session.user.username == undefined) {
    res.redirect("/login")
    return;
  }

  try {
    
    const allRooms = await Room.model.find({}).populate('owner').populate('members')
    var rooms = []
    allRooms.forEach(room => {

      const dates = utils.readableDate(room.time);
      var members = []
      room.members.forEach(member => {
        members.push({
          username: member.username,
          pfp: member.pfp
        })
      })

      rooms.push(
        {
          roomName: room.name,
          joinType: room.joins,
          creationTime: dates.days + " days ago, " + dates.hrs  + " hours ago, " + dates.min + " minutes ago.",
          members: members,
        }
      )
    })
    res.render('browserooms', { rooms:rooms, myName:req.session.user.username } )

  } catch(err) {
    console.log(err)
  }

})


router.post('/rooms', async (req, res) => {

  try {
    const room = await Room.model.find({name: req.body.roomName}).populate('owner').populate('members')
    const user = await User.find({username: req.session.user.username})

    if (room[0] == undefined) {
      res.status(400).send('"ERROR: ROOM NOT FOUND"')
      return;
    } 

    if (room[0].password !== req.body.password) {
      res.status(400).send('"WRONG PASSWORD"')
      return;
    }
    var memberIdList = []
    room[0].members.forEach(member => {
      memberIdList.push(member.id)
    }) 
    if (memberIdList.includes(user[0].id)) {
      res.status(400).send('"ERROR: YOU ARE ALREADY IN THIS ROOM"')
      return;
    }
    
    room[0].members.push(user[0])
    room[0].save()

    const newUrl = "/rooms/"+room[0].id
    res.send(JSON.stringify(newUrl))
  } catch (err) {
    console.log(err)
  }
})


router.post('/rooms/create', async (req, res) => {

  try {
    

    const user = await User.find({username: req.session.user.username})
    if (user[0]) {
      
      var roomName = req.body.roomName
      var roomType = req.body.roomType
      var roomPassword = req.body.roomPassword 

      if (req.body.roomName.replace(/ /g,'') == "") {
        roomName = user[0].username + "'s Room";
      }
      if (roomType == "Open") {
        roomType = Room.JOINTYPE.PUBLIC
      } else {
        roomType = Room.JOINTYPE.PRIVATE
      }

      const newRoom = new Room.model({
        name: roomName,
        password: roomPassword,
        joins: roomType,
        time: Date.now(),
        owner: user[0]._id,
        members: [user[0]._id],
      })

      await newRoom.save();
      res.redirect("/rooms/"+newRoom.id)

    }

  } catch (err) {

  }
})

>>>>>>> master
module.exports = router;