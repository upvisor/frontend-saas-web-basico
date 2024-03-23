import CartContext from '@/context/cart/CartContext'
import { ICartProduct, IProduct } from '@/interfaces'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useContext } from 'react'

export const Quantity = ({ product }: { product: ICartProduct }) => {

  const { cart, setCart } = useContext(CartContext)

  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: [] }

  return (
    <>
      {
        cart?.length
          ? (
            <div className='flex gap-4'>
              <div className='flex border rounded-md border-button w-fit h-fit mt-auto mb-auto'>
                {
                  product.quantity > 1
                    ? <button className='pt-1 pb-1 pl-3 pr-2 text-button text-sm' onClick={async () => {
                      const index = cart?.findIndex((item: ICartProduct) => item === product)
                      const productEdit: ICartProduct = cart[index]
                      const updateProduct: ICartProduct = { ...productEdit, quantity: productEdit.quantity - 1 }
                      cart[index] = updateProduct
                      const updateCart = JSON.stringify(cart)
                      localStorage.setItem('cart', updateCart)
                      setCart(JSON.parse(localStorage.getItem('cart')!))
                      if (status === 'authenticated') {
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                      }
                    }}>-</button>
                    : <button className='pt-1 pb-1 pl-3 pr-2 text-button/50 cursor-not-allowed text-sm'>-</button>
                }
                <span className='text-button m-auto w-4 text-center text-sm'>{product.quantity}</span>
                {
                  product.quantity < product.stock!
                    ? <button className='pt-1 pb-1 pl-2 pr-3 text-button text-sm' onClick={async () => {
                      const index = cart.findIndex((item: ICartProduct) => item === product)
                      const productEdit: ICartProduct = cart[index]
                      const updateProduct: ICartProduct = { ...productEdit, quantity: productEdit.quantity + 1 }
                      cart[index] = updateProduct
                      const updateCart = JSON.stringify(cart)
                      localStorage.setItem('cart', updateCart)
                      setCart(JSON.parse(localStorage.getItem('cart')!))
                      if (status === 'authenticated') {
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                      }
                    }}>+</button>
                    : <button className='pt-1 pb-1 pl-2 pr-3 text-button/50 cursor-not-allowed'>+</button>
                }
              </div>
              <button onClick={async () => {
                const cartProduct: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
                const productSelect = cartProduct.filter((item: ICartProduct) => item.name === product.name)
                if (productSelect.length >= 2) {
                  const products = cartProduct.filter(item => item.variation?.variation !== product.variation?.variation || item.variation?.subVariation !== product.variation?.subVariation || item.variation?.subVariation2 !== product.variation?.subVariation2)
                  localStorage.setItem('cart', JSON.stringify(products))
                  setCart(products)
                  if (status === 'authenticated') {
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                  }
                } else {
                  const products = cartProduct.filter(item => item.name !== product.name)
                  localStorage.setItem('cart', JSON.stringify(products))
                  setCart(products)
                  if (status === 'authenticated') {
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                  }
                }
              }}>
                <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                  <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          )
          : ''
      }
    </> 
  )
}
