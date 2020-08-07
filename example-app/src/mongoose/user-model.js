const mongoose = require('mongoose')
const { Schema } = mongoose
const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validateEmail = email => EMAIL_REGEXP.test(email);

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  auth: {
    password: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User