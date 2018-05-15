const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const adminSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type:String, required: true},
  password: {type:String, required: true},
  email: {type:String, required: true, unique: true},
  role: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});




const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;