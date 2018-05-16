const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Teacher = require("../models/Teacher");



const courseSchema = new Schema({
  name: {type:String, required: true},
  description: {type:String, required: true},
  category:{type:String, required: true},
  language: {type: String, required: true},
  image: {type: String},
  author: {
    type: Schema.Types.ObjectId,
    ref: "Teacher"
  },
  videos: [{vidName:String, videoUrl: String}],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course"
    }
  ],
  qna: Array,
  status: {
    type: String,
    enum: ["active", "in-active"],
    default: ["in-active"]
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});



const Course = mongoose.model('Course', courseSchema);
module.exports = Course;