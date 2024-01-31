import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
  category: { type: String, required: true },
  description: { type: String },
  slug: { type: String, required: true, unique: true },
  image: { public_id: { type: String }, url: { type: String } },
  titleSeo: { type: String },
  descriptionSeo: { type: String }
}, {
  timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

export default Category
