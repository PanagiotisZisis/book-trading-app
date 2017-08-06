'use strict';

const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');
const bcrypt = require('bcryptjs');

module.exports = passport => {

  passport.use(new LocalStrategy((username, password, done) => {

    Users.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'Incorrect Username' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect Password' });
      });

    });

  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });

};