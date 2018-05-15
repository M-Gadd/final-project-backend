const express = require("express");
const passport = require('passport');
const courseRoutes = express.Router();
const Course = require("../models/Course");
const mongoose = require("mongoose");
const multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");


cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});


  const storage =
  cloudinaryStorage({
    cloudinary,
    folder: 'courses',
    params: {
      resource_type: "raw"
    }
  });
  
  const upload = multer({ storage })

// Bcrypt to encrypt passwords
// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;


// teacherRoutes.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));




// courseRoutes.post("/signup", upload.fields([{name: 'image'}, {name: 'video'}]), (req, res, next) => {

courseRoutes.post("/:userId/add", (req, res, next) => {
  const {name, description, category, language} = req.body
  
  // const {originalname, secure_url} = req.files["image"][0];  
  // const video = req.files['videoFile'].map(function(vid){
  //   const {originalname, secure_url} = vid;
  //   return {name: originalname, mediaFile: secure_url}
  // })

  if (name === "" || description === "" || category === "" || language === "") {
    const err = new Error("Please fill in all fields");
    err.status = 400;
    next(err);
    return;
  }

  // Course.findOne({ email }, "email", (err, user) => {
  //   if (user !== null) {
  //     res.render("auth/signup", { message: "The email already exists" });
  //     return;
  //   }

  Course.create({name, description, category, language, author: req.params.userId})
  .then((newCourse)=>{
      res.json(newCourse);
  })

  .catch((err)=>{
    next(err);
  })
  
    // const salt = bcrypt.genSaltSync(bcryptSalt);
    // const hashPass = bcrypt.hashSync(password, salt);

    // const newCourse = new Course({
    //   name,
    //   description,
    //   category,
    //   language,
    //   status,
    //   image: secure_url,
    //   video: video
    // });

    // newCourse.save((err) => {
    //   if (err) {
    //     res.render("auth/signup", { message: "Something went wrong" });
    //   } else {
    //     res.redirect("/");
    //   }
    // });
  });
// });

// GET /api/course/:courseId
courseRoutes.get("/:courseId", (req,res,next) =>{ 
  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
      next();  // show 404 if bad ObjectId format
      return;
  }
  Course.findById(req.params.courseId)
  .then((course)=>{
    if(!course) {
      next(); // show 404 if no course was found 
      return;
    }
    res.json(course);
  })
  .catch((err)=>{
    next(err);
  });
});


// PUT /api/course/:courseId/edit
courseRoutes.put("/:courseId/edit", (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  const {name, description, category, language} = req.body;

  Course.findByIdAndUpdate (
    req.params.courseId,
    {name, description, category, language}, 
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateCourse)=> {
    if(!updateCourse) {
      next(); // show 404 if no course was found 
      return;
    }
    res.json(updateCourse);
  })

  .catch((err)=>{
    next(err);
  })
})


// PUT /api/course/:courseId/edit/picture
courseRoutes.put("/:courseId/editpicture", upload.single('image'), (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  const {secure_url} = req.file

  Course.findByIdAndUpdate (
    req.params.courseId,
    {image: secure_url}, 
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateCourse)=> {
    if(!updateCourse) {
      next(); // show 404 if no course was found 
      return;
    }
    res.json(updateCourse);
  })

  .catch((err)=>{
    next(err);
  })
})


courseRoutes.get("/:courseId/videos", (req,res,next)=>{
  Course.findById(req.params.courseId)
  .then((course)=>{
    if(!course) {
      next(); // show 404 if no course was found 
      return;
    }

    res.json(course.videos);
  })
  .catch((err)=>{
    next(err);
  });
});
//     .find()
//     .sort({createdAt: -1 })
//     .then((course)=>{
//       res.json(course.videos);
//     })
//     .catch((err)=>{
//       next(err);
//     });

// })


// router.put("/course/:courseId/videos/add", (req,res,next)=>{}) // AAAASSSKKKK
courseRoutes.put("/:courseId/videos/add", upload.single('video'), (req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  const {originalname, secure_url} = req.file;

  Course.findByIdAndUpdate (
    req.params.courseId,
    {name:originalname, videoUrl:secure_url}, 
    {runValidators: true, new: true }  //new gets us the updated version
  )
  .then((updateCourse)=> {
    if(!updateCourse) {
      next(); // show 404 if no course was found 
      return;
    }
    res.json(updateCourse);
  })

  .catch((err)=>{
    next(err);
  })
})


courseRoutes.delete("/:courseId/videos/:videoId", (req,res,next)=>{ // Check Later !!! 
Course.findByIdAndUpdate (
  req.params.courseId,
  {$pull:{videos:{_id: req.params.videoId}}}, 
  {runValidators: true, new: true }  //new gets us the updated version
)
.then((updateCourse)=> {
  if(!updateCourse) {
    next(); // show 404 if no course was found 
    return;
  }
  res.json(updateCourse);
})

.catch((err)=>{
  next(err);
});
});




// Delete /api/course/:courseId
courseRoutes.delete("/:courseId", (req,res,next) =>{
  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
    next();  // show 404 if bad ObjectId format
    return;
}
  Course.findByIdAndRemove(req.params.courseId)
  .then((removeCourse)=>{
    if(!removeCourse) {
      next(); // show 404 if no course was found 
      return;
    }
    res.json(removeCourse);
  })
  .catch((err)=>{
    next(err);
  });
})

// courseRoutes.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

module.exports = courseRoutes;
