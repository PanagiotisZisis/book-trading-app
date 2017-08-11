'use strict';

const request = require('request');
const Books = require('../models/books');

module.exports = app => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/api', isLoggedIn, (req, res) => {

    const title = req.query.title;
    const key = process.env.API_KEY;

    if (!title) {
      return res.json({ error: 'no title' });
    }
    
    request(`https://www.googleapis.com/books/v1/volumes?q=${title}&printType=books&maxResults=40&key=${key}`, (error, response, body) => {

      /*console.log('error', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);*/

      if (error) {
        return res.json(JSON.parse(error));
      }
      res.json(JSON.parse(body));
    });

  });

  app.post('/api', isLoggedIn, (req, res) => {

    const username = req.user.username;
    const title = req.body.title;
    const authors = req.body.authors;
    const img = req.body.img;

    const newBook = {
      username,
      title,
      authors,
      img
    };

    Books.create(newBook, err => {
      if (err) throw err;
      res.json({ success: 'book added successfully' });
    });
    
  });

};