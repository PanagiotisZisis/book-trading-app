'use strict';

module.exports = (app, io) => {
  app.get('/', (req, res) => {
    
    /*io.on('connection', socket => {
      socket.emit('message', 'message from server');

      socket.on('reply', msg => {
        console.log(msg);
      });

    });*/

    req.flash('greeting', 'such wow');
    res.render('index', { flash: req.flash('greeting') });
  });
};