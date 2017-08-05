'use strict';

module.exports = (app, io) => {

  app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
};