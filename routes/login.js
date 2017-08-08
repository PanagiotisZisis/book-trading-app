'use strict';

const passport = require('passport');

module.exports = app => {

  app.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error') });
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
};