const mongoose = require('mongoose');
require('dotenv').config();
const { format } = require('date-fns');
const User = require('./user');
const Comment = require('./comment');

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI);

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  time_stamp: { type: Date },
  description: { type: String, required: true, maxLength: 1500 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, required: true },
});

PostSchema.virtual('url').get(function () {
  return `/posts/${this._id}`;
});

PostSchema.virtual('time_stamp_formatted').get(function () {
  return format(this.time_stamp, "MMM dd, yyyy hh:mm a");
});

module.exports = mongoose.model("Post", PostSchema);
