'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  bookId: String,
  sender: String,
  recipient: String,
  title: String,
  img: String,
  authors: [String]
});

module.exports = mongoose.model('trades', tradeSchema);