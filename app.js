require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session      = require("express-session");
const MongoStore   = require('connect-mongo')(session);
const cors         = require('cors');
const bcrypt       = require('bcrypt');
    

mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  // 'mongodb://localhost/final-project-backend'
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));
  

// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  cookie: { expires: new Date(253402300000000) }
}))

require('./passport')(app);
    

const authRoutes = require('./routes/auth');
app.use('/user', authRoutes);

const teacherRoutes = require('./routes/auth-teacher');
app.use('/teacher', teacherRoutes);

const courseRoutes = require('./routes/auth-course');
app.use('/course', courseRoutes);

const adminRoutes = require('./routes/auth-admin');
app.use('/admin', adminRoutes);
      

module.exports = app;

//to divert any url to the angular routes
app.use((req,res,next) => {
  res.sendFile(__dirname + '/public/index.html');
});
