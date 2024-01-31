import { createContext } from 'react'
import { ICartProduct } from '../../interfaces'

interface ContextProps {
  cart: ICartProduct[] | undefined
  setCart: any
}

const CartContext = createContext({} as ContextProps)

export default CartContext