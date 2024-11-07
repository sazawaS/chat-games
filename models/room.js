const mongoose = require('mongoose')

const JOINTYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private',
}


const roomSchema = new mongoose.Schema({
  name:{
    type:String
  },
  password:{
    type:String
  },
  joins: {
    type:String,
  },
  time: {
    type:Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

})

module.exports = { model: mongoose.model('Room', roomSchema), JOINTYPE:JOINTYPE };