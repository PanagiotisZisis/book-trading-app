'use strict';

module.exports = (app, io) => {

  app.get('/login', (req, res) => {
    res.render('login');
  });
  
};