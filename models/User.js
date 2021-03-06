const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type:String, required: true},
  password: {type:String, required: true},
  age: Number,
  language: String,
  email: {type:String, required: true, unique: true},
  image: String,
  fieldsOfInterest: Array,
  nationality: String,
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course"
    }
  ],
  role: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
