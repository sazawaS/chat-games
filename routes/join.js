const express = require("express")
const router = express.Router()
const session = require('express-session');


const User = require("../models/user")
const Room = require("../models/room")
const utils = require("../modules/Utils")

router.get('/', (req, res) => {
  
  if (req.session.user && req.session.user.username) {
    res.redirect("join/rooms")
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
      res.redirect('join/rooms')
    }
  } catch { 
    res.render('login', { errorMessage: 'Wrong password or username! Dont have an account?'})
  }

})


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
      res.send('"ERROR: ROOM NOT FOUND"')
      return;
    } 

    if (room[0].password !== req.body.password) {
      res.send('"WRONG PASSWORD"')
      return;
    }
    var memberIdList = []
    room[0].members.forEach(member => {
      memberIdList.push(member.id)
    }) 
    if (memberIdList.includes(user[0].id)) {
      res.send('"ERROR: YOU ARE ALREADY IN THIS ROOM"')
      return;
    }
    
    room[0].members.push(user[0])
    room[0].save()

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
    }

  } catch (err) {

  }
})

module.exports = router;