const express = require("express");
const passport = require('passport');
const teacherRoutes = express.Router();
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const mongoose = require("mongoose");

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
    folder: 'teachers',
    // params: {
    //   resource_type: "raw"
    // }
  });

const upload = multer({ storage })


teacherRoutes.post('/login', (req,res,next) =>{
  const myFunction = 
      passport.authenticate('local', (err, theTeacher) => {
        if (err) {
          next(err);
          return;
        }
        if (!theTeacher) {

          const err = new Error("log in failed");
          err.status = 400;
          next(err);
          return;
        }
        req.login(theTeacher, () => {
          theTeacher.password = undefined;
          res.json({userInfo: theTeacher});
        })
    });
    myFunction(req,res,next);
  });



teacherRoutes.post("/signup", (req, res, next) => {
  const {firstName, lastName, password, email} = req.body;

  // const {originalname, secure_url} = req.file;

  if (password === "" || firstName === "" || lastName === "" || email === "") {
    const err = new Error("Please fill in all fields");
    err.status = 400;
    next(err);
    return;
  }

  Teacher.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      const err = new Error("Email already exists");
      err.status = 200;
      next(err);
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newTeacher = new Teacher({
      firstName,
      lastName,
      password: hashPass,
      email,
      role: "teacher"
    });

    newTeacher.save((err) => {
      if (err) {
        next(err);
      } else {
        req.login(newTeacher, () => {  // to make the user logged in directly after signing up
          newTeacherssword = undefined; //=====> IMPORTANT
          res.json({userInfo: newTeacher});
      });
      }
    });
  });
});


// GET /api/teacher/:teacherId
teacherRoutes.get("/:teacherId", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.teacherId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  Teacher.findById(req.params.teacherId)
  .then((teacher)=>{
    if(!teacher) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(teacher);
  })
  .catch((err)=>{
    next(err);
  });
});


// PUT /api/teacher/:teacherId/edit
teacherRoutes.put("/:teacherId/edit", (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.teacherId)){
    next();  // show 404 if bad ObjectId format
    return;
}

const {firstName, lastName, userName, description, age, 
  language, email, fieldsOfSpeciality, nationality, 
  qualifications} = req.body;


  Teacher.findByIdAndUpdate (
    req.params.teacherId,
    {firstName, lastName, description, age, 
      language, email, fieldsOfSpeciality, nationality, 
      qualifications}, // =======>>>>>>>>>> AAAAASSSSKKKKKK
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateTeacher)=> {
    if(!updateTeacher) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(updateTeacher);
  })

  .catch((err)=>{
    next(err);
  })
})


// PUT /api/teacher/:teacherId/editpicture
teacherRoutes.post("/:teacherId/editpicture", upload.single('file'), (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.teacherId)){
    next();  // show 404 if bad ObjectId format
    return;
}

const {secure_url} = req.file;


  Teacher.findByIdAndUpdate (
    req.params.teacherId,
    {image: secure_url}, // =======>>>>>>>>>> AAAAASSSSKKKKKK
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateTeacher)=> {
    if(!updateTeacher) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(updateTeacher);
  })

  .catch((err)=>{
    next(err);
  })
})

// GET /teacher/:teacherId/course
teacherRoutes.get("/:teacherId/courses", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.teacherId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  Teacher.findById(req.params.teacherId).populate("courses")
  .then((teacher)=>{
    if(!teacher) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(teacher.courses);
  })
  .catch((err)=>{
    next(err);
  });
});


teacherRoutes.get("/:teacherId/courses/:courseId", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  Course.findById(req.params.courseId)
  .then((course)=>{
    if(!course) {
      next(); // show 404 if no phone was found 
      return;
    }
    res.json(course);
  })
  .catch((err)=>{
    next(err);
  });
});


teacherRoutes.get("/homecourses", (req,res,next)=>{
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

// Dele/:teacherId
teacherRoutes.delete("/:teacherId", (req,res,next) =>{
  if(!mongoose.Types.ObjectId.isValid(req.params.teacherId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  Teacher.findByIdAndRemove(req.params.teacherId)
  .then((removeTeacher)=>{
    if(!removeTeacher) {
      next(); // show 404 if no teacher was found 
      return;
    }
    res.json(removeTeacher);
  })
  .catch((err)=>{
    next(err);
  });
})

teacherRoutes.get("/logout", (req, res) => {
  req.logout();
  res.json({userInfo: null});
});

//addition
teacherRoutes.get("/checklogin", (req,res,next)=>{
  if (req.user) {
    req.user.password = undefined;
  }
  res.json({ userInfo: req.user });
});

module.exports = teacherRoutes;
