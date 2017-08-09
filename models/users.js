'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  city: String,
  state: String,
  books: [[]]
});

module.exports = mongoose.model('users', userSchema);