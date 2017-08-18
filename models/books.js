'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  username: String,
  title: String,
  authors: [String],
  img: String,
  tradeExists: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('books', bookSchema);