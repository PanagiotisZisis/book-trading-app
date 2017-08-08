'use strict';

const Users = require('../models/users');

module.exports = app => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/profile/:userid', isLoggedIn, (req, res) => {
    Users.findById(req.params.userid, (err, doc) => {
      if (err) throw err;
      res.render('profile', { user: doc, message: false });
    });
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.redirect('/profile/' + req.user._id);
  });

  app.post('/profile/:userid', isLoggedIn, (req, res) => {
    const userid = req.params.userid;
    if (req.user._id == userid) {
      const { fullName, city, state } = req.body;
      if (fullName.length > 20 || city.length > 20 || state.length > 20) {
        return res.render('profile', { user: req.user, message: 'Please keep your info under 20 characters long.' });
      }
      const updatedDoc = {
        name: fullName,
        city,
        state
      };
      Users.update({ _id: userid }, updatedDoc, err => {
        if (err) throw err;
      });
      Users.findById(userid, (err, doc) => {
        if (err) throw err;
        res.render('profile', { user: doc, message: 'Changes Saved Successfully.' });
      });
    }
  });

};