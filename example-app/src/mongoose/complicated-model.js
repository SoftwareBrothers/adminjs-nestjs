const mongoose = require('mongoose')

const { Schema } = mongoose

const Nested = new Schema({
  extremelyNested: String,
}, { _id: false })

const ImageVariant = new mongoose.Schema({
  imageURL: String,
  isApproved: Boolean,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  isDeleted: Boolean
}, { _id: false });

const Item = new mongoose.Schema({
  imageVariants: [ImageVariant],
}, { _id: false })

const NestedSchema = new Schema({
  age: {
    type: Number,
    required: true,
  },
  height: Number,
  placeOfBirth: String,
  nested: Nested,
}, { _id: false })

const ParentSchema = new Schema({
  name: String,
  surname: String,
}, { _id: false })

const ComplicatedSchema = new Schema({
  name: String,
  stringArray: {
    type: [String],
    required: true,
  },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  nestedDetails: {
    type: NestedSchema
  },
  parents: [ParentSchema],
  Item : [Item],
}, { timestamps: true })

const Complicated = mongoose.model('Complicated', ComplicatedSchema)

module.exports = Complicated
