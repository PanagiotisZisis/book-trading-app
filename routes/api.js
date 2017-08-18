'use strict';

const request = require('request');
const Books = require('../models/books');
const Trades = require('../models/trades');

module.exports = (app, io) => {

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

    Books.create(newBook, (err, addedBook) => {
      if (err) throw err;
      res.json(addedBook);
    });
    
  });

  app.delete('/api', isLoggedIn, (req, res) => {

    const { bookId } = req.body;
    
    Books.deleteOne({ _id: bookId }, err => {
      if (err) throw err;
      res.json({ success: 'successful delete', id: bookId });
    });

  });

  app.get('/api/allBooks', isLoggedIn, (req, res) => {

    const user = req.user.username;

    Books.find({}, (err, docs) => {
      if (err) throw err;
      const allBooks = docs.filter(book => {
        return book.username !== user;
      });
      if (allBooks.length === 0) {
        return res.json({ docs: false });
      }
      res.json({ allBooks });
    });

  });

  app.get('/api/trade', isLoggedIn, (req, res) => {
    const user = req.user.username;
    let books = [];

    Trades.find({ sender: user }, (err, senderDocs) => {
      if (err) throw err;
      if (senderDocs) {

        senderDocs.forEach(doc => {
          books.push(doc);
        });

        Trades.find({ recipient: user }, (err, recipientDocs) => {
          if (err) throw err;
          if (recipientDocs) {

            recipientDocs.forEach(doc => {
              books.push(doc);
            });

            return res.json({ books });
          }
          res.json({ books });
        });

      } else {
        Trades.find({ recipient: user }, (err, recipientDocs) => {
          if (err) throw err;
          if (recipientDocs) {

            recipientDocs.forEach(doc => {
              books.push(doc);
            });

            return res.json({ books });
          }
          res.json({ books: false });
        });

      }
      
    });

  });

  app.post('/api/trade', isLoggedIn, (req, res) => {
    console.log(req.body);

    const sender = req.user.username;
    const recipient = req.body.username;
    const bookId = req.body.bookId;
    const title = req.body.title;

    const newTrade = {
      bookId,
      sender,
      recipient,
      title
    };

    Trades.findOne(newTrade, (err, doc) => {
      if (err) throw err;
      if (!doc) {

        Trades.create(newTrade, err => {
          if (err) throw err;
        });

        Books.findOne({ _id: bookId }, (err, doc) => {
          if (err) throw err;
          if (doc) {
            let toggleValue = !doc.tradeExists;

            const updatedDoc = {
              tradeExists: toggleValue
            };

            Books.update({ _id: bookId }, updatedDoc, err => {
              if (err) throw err;
              res.json({ sucess: 'successful trade request' });
            });

          }

        });

      }

    });

  });

};