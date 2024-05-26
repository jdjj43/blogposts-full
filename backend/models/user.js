const mongoose = require('mongoose');
require('dotenv').config();
const post = require('./post');
const comment = require('./comment');

const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/culo');

const UserSchema = new Schema({
  full_name: { type: String, required: true, maxLength: 100},
  username: { type: String, required: true, maxLength: 20 },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  author: { type: Boolean },
})

module.exports = mongoose.model("User", UserSchema);