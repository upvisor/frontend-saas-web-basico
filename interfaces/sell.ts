import { ICartProduct } from "./cart"

export interface ISell {
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: number
  address: string
  details?: string
  region: string
  city: string
  total: number
  cart: ICartProduct[]
  coupon?: string
  shipping: number
  shippingMethod: string
  pay: string
  state: string
  fbp?: string
  fbc?: string
  shippingState: string
  subscription: boolean
  buyOrder: string

  createdAt?: Date
  updatedAt?: Date
}