export interface IProduct {
  _id: string
  name: string
  description: string
  images: { public_id: string, url: string }[]
  stock: number
  price: number
  beforePrice?: number
  cost?: number
  timeOffer?: string
  variations?: ITypeVariation
  nameVariations?: String
  productsOffer?: IProductsOffer[]
  slug: string
  tags: string[]
  category: { category: string, slug: string }
  reviews?: IReview[]
  state: boolean
  titleSeo?: string
  descriptionSeo?: string
  quantityOffers?: IQuantityOffer[]
  sku?: string

  createdAt: string
  updatedAt: string
}

export interface IReview {
  _id?: string
  calification: number
  name: string
  email?: string
  title?: string
  review: string
  createdAt: Date
}

export interface IProductsOffer {
  productsSale: IProductOffer[]
  price: number
}

export interface IProductOffer {
  name: string
  price: number
  beforePrice: number
  images: { public_id: string, url : string }[]
  slug: string
  variations?: { nameVariation: string, variations: IVariation[] }
  category: { category: string, slug: string }
}

export interface ITypeVariation {
  nameVariation: string
  nameSubVariation?: string
  variations: IVariation[]
}

export interface IVariation {
  variation: string
  subVariation?: string
  stock: number
  image?: { public_id: string, url: string }
  sku?: string
}

export interface IQuantityOffer {
  _id?: string
  quantity: number
  descount: number
}