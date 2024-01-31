import { db } from "."
import { ICategory, IProduct } from "../interfaces"
import { Product, Category } from '../models'

export const getProductBySlug = async ( slug: string ): Promise<IProduct | null> => {
  await db.connectDB()
  const product = await Product.findOne({ slug }).lean()

  if ( !product ) {
    return null
  }

  return JSON.parse( JSON.stringify( product ) )
}

interface ProductSlug {
  slug: string
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connectDB()
  const slugs = await Product.find().select('slug -_id').lean()

  return slugs
}

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connectDB()
  const products = await Product.find().lean()
  return JSON.parse( JSON.stringify( products ) )
}

interface CategorySlug {
  slug: string
}

export const getAllcategoriesSlug = async (): Promise<CategorySlug[]> => {
  await db.connectDB()
  const slugs = await Category.find().select('slug -_id').lean()

  return slugs
}

export const getCategoriesBySlug = async (slug: string): Promise<ICategory | null> => {
  await db.connectDB()
  const category = await Category.findOne({ slug }).lean()

  if ( !category ) {
    return null
  }

  return JSON.parse( JSON.stringify( category ) )
}
