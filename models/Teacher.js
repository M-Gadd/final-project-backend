const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const teacherSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type:String, required: true},
  password: {type:String, required: true},
  description: {type:String},
  language: String,
  age: Number,
  email: {type:String, required: true, unique: true},
  image: {type:String},
  fieldsOfSpeciality: Array,
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course"
    }
  ],
  nationality: String,
  qualifications: String,
  status: {
    type: String,
    enum: ["active", "in-active"],
    default: ["in-active"]
  },
  role: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});



const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;