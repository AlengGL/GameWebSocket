
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // 要求唯一值
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  lastLoginDate: {
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;