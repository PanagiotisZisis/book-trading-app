'use strict';

module.exports = (app, io) => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/dashboard/:userid', isLoggedIn, (req, res) => {
    res.render('dashboard', { user: req.user });
  });

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.redirect('/dashboard/' + req.user._id);
  });

};