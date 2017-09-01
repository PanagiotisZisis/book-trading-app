'use strict';

const Books = require('../models/books');
const Trades = require('../models/trades');

module.exports = (app, io) => {

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/dashboard/:userid', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render('dashboard', { user: req.user });
  });

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.redirect('/dashboard/' + req.user._id);
  });

  io.on('connect', socket => {

    socket.on('getMyBooks', (user) => {
      Books.find({ username: user }, (err, docs) => {
        if (err) throw err;
        if (docs.length === 0) {
         return socket.emit('getMyBooksReply', false);
        }
        socket.emit('getMyBooksReply', docs);
      });
    });
    
    socket.on('refresh', () => {
      io.emit('refreshReply');
    });

    socket.on('refreshPending', () => {
      io.emit('refreshPendingReply');
    });

    socket.on('tradeAccepted', id => {
      Trades.findById(id, (err, doc) => {
        if (err) throw err;
        const bookId = doc.bookId;
        const sender = doc.sender;
        let updatedDoc = {
          username: sender,
          tradeExists: false
        };

        Books.update({ _id: bookId}, updatedDoc, err => {
          if (err) throw err;

          Trades.remove({ bookId }, err => {
            if (err) throw err;
            io.emit('tradeAcceptedReply');
          });
        });
      });
    });

    socket.on('tradeRejected', id => {
      Trades.findById(id, (err, doc) => {
        if (err) throw err;
        const bookId = doc.bookId;
        Trades.deleteOne({ _id: id }, err => {
          if (err) throw err;
          Trades.find({ bookId }, (err, docs) => {
            if (err) throw err;
            if (!docs || docs.length === 0) {
              let updatedDoc = {
                tradeExists: false
              };
              Books.update({ _id: bookId }, updatedDoc, err => {
                if (err) throw err;
                io.emit('tradeRejectedReply');
              });
            }
          });
        });
      });
    });

  });

};