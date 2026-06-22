const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
  },
  email: {
    type: String,
    required: true, // Email is mandatory
    unique: true,   // Ensures no duplicate emails
  },
  password: {
    type: String,
    required: true, // You should store hashed passwords here
  },
  role: {
    type: String,
    required: true, // Example values: 'student' or 'teacher'
  },
  verified: {
    type: Boolean,
    default: false, // Helpful if you're verifying emails
  },
  verificationCode: {
    type: Number, // Use for email OTP or similar
  },
  verificationCodeExpires: {
    type: Date, // Use to auto-expire the verification code
  },
});
module.exports = mongoose.model("User", UserSchema);
