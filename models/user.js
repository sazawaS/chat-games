const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
  creationDate: {
    type: Date
  },
  pfp: {
    type: String,
    default: "http://localhost:3000/assets/DefaultPFP.jpg",
  }
})

module.exports = mongoose.model('User', userSchema);;