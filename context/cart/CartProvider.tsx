"use client"
import React, { PropsWithChildren, useState, useEffect } from 'react'
import { ICartProduct } from '../../interfaces'
import CartContext from './CartContext'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const [cart, setCart] = useState<ICartProduct[]>()
  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: ICartProduct[] }

  const getCart = async () => {
    if (status === 'authenticated') {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`)
      if (response.data.cart) {
        setCart(response.data.cart)
      }
    } else {
      setCart(JSON.parse(localStorage.getItem('cart')!))
    }
  }

  useEffect(() => {
    getCart()
  }, [session])

  return (
    <CartContext.Provider value={{
      cart,
      setCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider