'use strict';

const Books = require('../models/books');

module.exports = (app, io) => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/dashboard/:userid', isLoggedIn, (req, res) => {
    console.log(req.user);

    /*io.on('connect', socket => {
      
      socket.on('addBook', book => {

        const newBook = {
          username: req.user.username,
          title: book.title,
          authors: book.authors,
          img: book.img
        };

        Books.create(newBook, err => {
          if (err) throw err;
          socket.emit('addBookSuccess', 'new book added');
        });

      });
      
    });*/

    Books.find({ username: req.user.username }, (err, docs) => {
      if (err) throw err;
      if (docs.length === 0) {
        return res.render('dashboard', { user: req.user, userBooks: false });
      }
      res.render('dashboard', { user: req.user, userBooks: JSON.stringify(docs) });
    });

  });

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.redirect('/dashboard/' + req.user._id);
  });

};