const express = require("express");
const passport = require('passport');
const courseRoutes = express.Router();
const Course = require("../models/Course");
const mongoose = require("mongoose");
const multer = require('multer');
const Teacher = require('../models/Teacher')
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


// courseRoutes.post("/signup", upload.fields([{name: 'image'}, {name: 'video'}]), (req, res, next) => {

courseRoutes.post("/:userId/add", (req, res, next) => {
  console.log("I am in the backend")
  const {name, description, category, language} = req.body
  

  if (name === "" || description === "" || category === "" || language === "") {
    const err = new Error("Please fill in all fields");
    err.status = 400;
    next(err);
    return;
  }


  Course.create({name, description, category, language, author: req.params.userId})
  .then((newCourse)=>{
    Teacher.findByIdAndUpdate(
      req.params.userId,
      { $push: {courses: newCourse} },
      {runValidators: true, new: true} 
    )
    .then(()=>{
      res.json(newCourse);
      return;
    })

  })

  .catch((err)=>{
    next(err);
  })
  
  });

  courseRoutes.get("/homecourses", (req,res,next)=>{
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
courseRoutes.post("/:courseId/editpicture", upload.single('file'), (req,res,next)=>{

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
courseRoutes.post("/:courseId/videos/add", upload.single('file'), (req,res,next)=>{

  // console.log("BACCCCCKKKK EEEEENNNNDDD")

  if(!mongoose.Types.ObjectId.isValid(req.params.courseId)){
    next();  // show 404 if bad ObjectId format
    return;
} 
// console.log(req.file);
  const {originalname, secure_url} = req.file;

  Course.findByIdAndUpdate (
    req.params.courseId,
    {vidName:originalname, videoUrl:secure_url}, 
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
