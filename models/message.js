const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  username:{
    type:String
  },
  text:{
    type:String
  },
  time: {
    type:Number,
  },
  pfp : {
    type:String,
  }
})

module.exports = mongoose.model('Message', messageSchema);;