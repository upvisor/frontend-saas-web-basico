import { IQuantityOffer, IVariation } from "."

export interface ICartProduct {
  _id?: string
  name: string
  image: string
  price: number
  beforePrice?: number
  variation?: IVariation
  subVariation?: string
  slug: string
  quantity: number
  stock?: number
  category: { category: string, slug: string }
  quantityOffers?: IQuantityOffer[]
  sku?: string
}