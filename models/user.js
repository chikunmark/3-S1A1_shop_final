const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now, // 載入當前 timestamp 函式
  },
})

module.exports = mongoose.model('User', userSchema)
