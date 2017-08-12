'use strict';

// dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();
// socket.io configuration
const io = require('socket.io').listen(app.listen(3000));

// view engine configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// db configuration
mongoose.connect(process.env.MONGO_DB);

// middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(compression());
app.use(cors());

// passport configuration
require('./config/passport')(passport);

// routes
require('./routes/index')(app);
require('./routes/signup')(app);
require('./routes/login')(app);
require('./routes/logout')(app);
require('./routes/dashboard')(app, io);
require('./routes/profile')(app);
require('./routes/api')(app, io);