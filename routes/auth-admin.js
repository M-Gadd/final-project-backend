const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const adminRoutes = express.Router();
const Admin = require("../models/Admin");
const multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const mongoose = require('mongoose');


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
    folder: 'teachers',
    params: {
      resource_type: "raw"
    }
  });

const upload = multer({ storage })



//GET /admin/users
adminRoutes.get("/users", (req,res,next)=>{
  User
    .find()
    // .limit(20)
    .sort({createdAt: -1 })
    .then((users)=>{
      res.json(users);
    })
    .catch((err)=>{
      next(err);
    });

})

//GET /admin/teachers
adminRoutes.get("/teachers", (req,res,next)=>{
  Teacher
    .find()
    // .limit(20)
    .sort({createdAt: -1 })
    .then((teachers)=>{
      res.json(teachers);
    })
    .catch((err)=>{
      next(err);
    });

})

//GET /admin/courses
adminRoutes.get("/courses", (req,res,next)=>{
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


// router.get('/users/:userId/makeadmin', (req, res, next)=>{
//   User.findByIdAndUpdate(
//     req.params.userId,
//     { $set: { role: "Admin" }},
//     {runValidators: true}
//   )
//   .then(()=>{
//     res.redirect("/admin/user-list");
//   })
//   .catch((err)=>{
//     console.log('something went wrong', err);
//   })
// });

// router.get('/users/:userId/unmakeadmin', (req, res, next)=>{
//   User.findByIdAndUpdate(
//     req.params.userId,
//     { $set: { role: "User" }},
//     {runValidators: true}
//   )
//   .then(()=>{
//     res.redirect("/admin/user-list");
//   })
//   .catch((err)=>{
//     console.log('something went wrong', err);
//   })
// });




module.exports = adminRoutes;
