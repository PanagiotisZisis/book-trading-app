'use strict';

const bcrypt = require('bcryptjs');
const Users = require('../models/users');

module.exports = app => {

  app.get('/signup', (req, res) => {
    res.render('signup', { errors: false });
  });

  app.post('/signup', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    let errors = [];
    const regex = /^[a-z0-9]{1,20}$/i;

    if (!regex.test(username)) {
      errors.push('<strong>Invalid Username</strong> - Please keep it under 20 characters long and use only letters or numbers.');
    }

    if (!regex.test(password)) {
      errors.push('<strong>Invalid Password</strong> - Please keep it under 20 characters long and use only letters or numbers.');
    }

    if (errors.length !== 0) {
      req.flash('signup', errors);
      return res.render('signup', { errors: JSON.stringify(req.flash('signup')) });
    }

    Users.findOne({ username }, (err, doc) => {
      if (err) throw err;
      // checking first if user already exists
      if (doc) {
        errors.push('This <strong>Username</strong> already exists.');
        req.flash('signup', errors);
        return res.render('signup', { errors: JSON.stringify(req.flash('signup')) });
      }
      // password hashing
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const newUser = new Users({
          username,
          password: hash
        });
        // adding new user
        newUser.save(err => {
          if (err) throw err;
          res.redirect('/login');
        });
        
      });

    });

  });
  
};