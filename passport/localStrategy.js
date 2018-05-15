const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const Teacher       = require('../models/Teacher')
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, next) => {
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      Teacher.findOne({ email }, (err, foundTeacher) => {
        if (err) {
          next(err);
          return;
        }
  
        if (!foundTeacher) {
          next(null, false, { message: 'Incorrect email' });
        return;  
        }

        if (!bcrypt.compareSync(password, foundTeacher.password)) {
            next(null, false, { message: 'Incorrect password' });
            return;
          }
          next(null, foundTeacher);
      });

      
    } else { 

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password' });
      return;
    }

    next(null, foundUser);
  }
  });
}));



// User.findOne({ email })
//   .then((foundUser) => {
//     if (foundUser) {
//       return foundUser;
//     }

//     return Teacher.find({ email })
//       .then((foundTeacher) => {
//         if (foundTeacher) {
//           return foundTeacher;
//         }
//         next(null, false, { message: 'Incorrect email' });
//       })
//   })
//   .then((foundPerson) => {
//     if (!foundPerson) {
//       return;
//     }

//     if (!bcrypt.compareSync(password, foundPerson.password)) {
//       next(null, false, { message: 'Incorrect password' });
//       return;
//     }

//     next(null, foundPerson);
//   })
//   .catch(err => {
//     next(err);
//   })