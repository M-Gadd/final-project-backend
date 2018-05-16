const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const mongoose = require('mongoose');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});


  const storage =
  cloudinaryStorage({
    cloudinary,
    folder: 'students',
    // params: {
    //   resource_type: "file"
    // }
  });

const upload = multer({ storage })


authRoutes.post('/login', (req,res,next) =>{
  const myFunction = 
      passport.authenticate('local', (err, theUser) => {
        if (err) {
          next(err);
          return;
        }
        if (!theUser) {
          const err = new Error("log in failed");
          err.status = 400;
          next(err);
          return;
        }
        req.login(theUser, () => {
          theUser.password = undefined;
          res.json({userInfo: theUser});
        })
    });
    myFunction(req,res,next);
  });



authRoutes.post("/signup", (req, res, next) => {

    const {firstName, lastName, password, email} = req.body 

  if (password === "" || firstName === "" || lastName === "" || email === "") {
    const err = new Error("Please fill in all fields");
    err.status = 400;
    next(err);
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      const err = new Error("Email already exists");
      err.status = 200;
      next(err);
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      password: hashPass,
      email,
      role: "user"
    });

    newUser.save((err) => {
      if (err) {
        next(err);
      } else {
        req.login(newUser, () => {  // to make the user logged in directly after signing up
          newUser.password = undefined; //=====> IMPORTANT
          res.json({userInfo: newUser});
        });
      }
    });
  });
});


// GET /api/user/:userId
authRoutes.get("/:userId", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  User.findById(req.params.userId)
  .then((user)=>{
    if(!user) {
      next(); // show 404 if no user was found 
      return;
    }
    res.json(user);
  })
  .catch((err)=>{
    next(err);
  });
});

authRoutes.get("/:userId/courses", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  User.findById(req.params.userId).populate("courses")
  .then((user)=>{
    if(!user) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(user.courses);
  })
  .catch((err)=>{
    next(err);
  });
});



authRoutes.get("/homecourses", (req,res,next)=>{
  Course
    .find()
    // .limit(20)
    .sort({createdAt: -1 })
    .then((courses)=>{
      console.log(courses)
      res.json(courses);
    })
    .catch((err)=>{
      next(err);
    });

})



// PUT /api/user/:userId/edit
authRoutes.put("/:userId/edit", (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    next();  // show 404 if bad ObjectId format
    return;
}
const {firstName, lastName, userName, age, language, 
  email, fieldsOfInterest, nationality} = req.body 

  User.findByIdAndUpdate (
    req.params.userId,
    {firstName, lastName, userName, age, language, 
      email, fieldsOfInterest, nationality}, // =======>>>>>>>>>> AAAAASSSSKKKKKK
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateUser)=> {
    if(!updateUser) {
      next(); // show 404 if no user was found 
      return;
    }
    res.json(updateUser);
  })

  .catch((err)=>{
    next(err);
  })
})

// PUT /api/user/:userId/editpicture
authRoutes.post("/:userId/editpicture",  upload.single('file'), (req,res,next)=>{
console.log("i reach the back end")
  if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    next();  // show 404 if bad ObjectId format
    return;
}

const { secure_url } = req.file; 

  User.findByIdAndUpdate (
    req.params.userId,
    {image: secure_url}, // =======>>>>>>>>>> AAAAASSSSKKKKKK
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateUser)=> {
    // console.log("HELLO" + image);
    if(!updateUser) {
      next(); // show 404 if no user was found 
      return;
    }
    res.json(updateUser);
  })

  .catch((err)=>{
    next(err);
  })
})


// Delete /api/user/:userId
authRoutes.delete("/:userId", (req,res,next) =>{
  if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  User.findByIdAndRemove(req.params.userId)
  .then((removeUser)=>{
    if(!removeUser) {
      next(); // show 404 if no user was found 
      return;
    }
    res.json(removeUser);
  })
  .catch((err)=>{
    next(err);
  });
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.json({userInfo: null});
});

//Additiom
authRoutes.get("/checklogin", (req,res,next)=>{
  if (req.user) {
    req.user.password = undefined;
  }
  res.json({ userInfo: req.user });
});

module.exports = authRoutes;
