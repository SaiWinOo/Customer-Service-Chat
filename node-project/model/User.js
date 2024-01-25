const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
    default: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f'
  }
})

module.exports = mongoose.model('User', UserSchema);