const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

var Blacklist = mongoose.model('Blacklist', BlacklistSchema);

module.exports = Blacklist;