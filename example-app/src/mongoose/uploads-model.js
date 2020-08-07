const mongoose = require('mongoose')
const { Schema } = mongoose

const UploadsSchema = new Schema({
  path: String,
  filename: String,
  mimeType: String,
  size: Number,
})

const Uploads = mongoose.model('Uploaded', UploadsSchema)

module.exports = Uploads