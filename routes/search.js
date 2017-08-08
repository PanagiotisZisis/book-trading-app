'use strict';

const request = require('request');

module.exports = app => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/search', isLoggedIn, (req, res) => {

    const title = req.query.title;
    const key = process.env.API_KEY;
    
    request(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=40&printType=books&key=${key}`, (error, response, body) => {
      console.log('error', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    });

  });

};