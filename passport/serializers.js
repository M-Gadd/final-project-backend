const passport = require('passport');
const User = require('../models/User');
const Teacher = require('../models/Teacher');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    
    if (!userDocument){
      Teacher.findById(userIdFromSession, (err, teacherDocument) => {
        if (err) {
          cb(err);
          return;
        }
        console.log('DESERALIZE teacher', teacherDocument)
        cb(null, teacherDocument);
      });
    } 
    else {
      console.log('DESERALIZE user', userDocument)
      cb(null, userDocument);
    }
  });
});
