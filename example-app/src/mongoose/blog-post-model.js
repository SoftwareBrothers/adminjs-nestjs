const mongoose = require('mongoose')

const { Schema } = mongoose

const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  createdBy: String,
}, { timestamps: true })

const BlogPost = mongoose.model('BlogPost', BlogPostSchema)

module.exports = BlogPost
