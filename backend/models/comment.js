const mongoose = require('mongoose');
require('dotenv').config();
const { format } = require('date-fns');
const User = require('./user');
const Post = require('./post');

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI);

const CommentSchema = new Schema({
  time_stamp: { type: Date },
  description: { type: String, required: true, maxLength: 1500 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.virtual('time_stamp_formatted').get(function () {
  return format(this.time_stamp, "MMM dd, yyyy hh:mm a");
});

module.exports = mongoose.model("Comment", CommentSchema);
