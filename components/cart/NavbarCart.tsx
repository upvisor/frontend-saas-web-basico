import Link from 'next/link'
import React, { useContext } from 'react'
import { ICartProduct } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import CartContext from '../../context/cart/CartContext'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { H3 } from '../ui'

interface Props {
  setCartView: any
  setCartPc?: any
  cartOpacity: any
  setCartOpacity: any
  setCartPosition: any
}

export const NavbarCart: React.FC<Props> = ({ setCartView, setCartPc, cartOpacity, setCartOpacity, setCartPosition }) => {

  const {cart, setCart} = useContext(CartContext)

  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: ICartProduct[] }

  return (
    <div onMouseEnter={() => setCartPc(false)} onMouseLeave={() => setCartPc(true)} className={`ml-auto ${cartOpacity} transition-opacity duration-200 flex flex-col gap-3 p-4 rounded-md shadow-md bg-white z-40 w-full dark:bg-neutral-900 dark:border dark:border-neutral-800 sm:w-96`}>
      <H3 config='border-b text-center pb-2'>CARRITO</H3>
      {
        cart?.length
          ? <>
            {
              cart.map((product: ICartProduct) => (
                <div key={product.slug} className='flex gap-1 justify-between mb-2'>
                  <div className='flex gap-2'>
                    <Link href={`/tienda/${product.category.slug}/${product.slug}`} onClick={() => {
                      setCartOpacity('opacity-0')
                      setCartPosition('-mt-[30px]')
                      setTimeout(() => {
                        setCartView('hidden')
                      }, 200)
                    }}>
                      <Image src={product.image} alt={product.name} width={96} height={96} className='w-24 h-24 mt-auto mb-auto' />
                    </Link>
                    <div className='mt-auto mb-auto'>
                      <Link href={`/tienda/${product.category.slug}/${product.slug}`} onClick={() => {
                        setCartOpacity('opacity-0')
                        setCartPosition('-mt-[30px]')
                        setTimeout(() => {
                          setCartView('hidden')
                        }, 200)
                      }}><p className='text-[16px] text-[#1B1B1B] dark:text-neutral-100'>{product.name}</p></Link>
                      <div className='flex gap-1 mb-1'>
                        {
                          product.quantityOffers && product.quantity > 1
                            ? <span className='font-medium'>${NumberFormat(offer(product))}</span>
                            : <span className='font-medium'>${NumberFormat(product.price * product.quantity)}</span>
                        }
                        {
                          product.beforePrice
                            ? <span className='text-sm line-through text-[#444444] dark:text-neutral-400'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                            : ''
                        }
                      </div>
                      <div className='flex border rounded border-button w-fit'>
                        {
                          product.quantity > 1
                            ? <button className='pt-1 pb-1 pl-3 pr-2 text-button text-sm' onClick={async () => {
                              const index = cart.findIndex((item: ICartProduct) => item === product)
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
                            : <button className='pt-1 pb-1 pl-2 pr-3 text-button/50 cursor-not-allowed text-sm'>+</button>
                        }
                      </div>
                    </div>
                  </div>
                  <button onClick={async () => {
                    const cartProduct = JSON.parse(localStorage.getItem('cart')!)
                    const productSelect = cartProduct.filter((item: ICartProduct) => item.name === product.name)
                    if (productSelect.length >= 2) {
                      const products = cartProduct.filter((item: ICartProduct) => item.variation?.variation !== product.variation?.variation)
                      localStorage.setItem('cart', JSON.stringify(products))
                      setCart(products)
                      if (status === 'authenticated') {
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                      }
                    } else {
                      const products = cartProduct.filter((item: ICartProduct) => item.name !== product.name)
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
              ))
            }
            <div className='mt-4'>
              <Link className='py-2 rounded border border-button font-medium text-sm transition-colors duration-200 bg-button text-white hover:bg-white hover:text-button hover:dark:bg-transparent' onClick={() => {
                setCartOpacity('opacity-0')
                setCartPosition('-mt-[30px]')
                setTimeout(() => {
                  setCartView('hidden')
                }, 200)
              }} href='/finalizar-compra'><button className='w-full tracking-widest'>FINALIZAR COMPRA</button></Link>
              <Link href='/carrito' onClick={() => {
                setCartOpacity('opacity-0')
                setCartPosition('-mt-[30px]')
                setTimeout(() => {
                  setCartView('hidden')
                }, 200)
              }}><button className='w-full mt-4 underline text-[#444444] dark:text-neutral-400'>Ir al carrito</button></Link>
            </div>
          </>
          : <>
            <p className='dark:text-neutral-400'>No tienes productos añadidos al carrito</p>
            <Link className='py-1.5 border border-main rounded transition-colors duration-200 bg-main text-white hover:bg-transparent hover:text-main dark:bg-neutral-700 dark:border-neutral-700 dark:hover:text-neutral-500 hover:dark:bg-transparent' href='/tienda' onClick={() => {
              setCartOpacity('opacity-0')
              setCartPosition('-mt-[30px]')
              setTimeout(() => {
                setCartView('hidden')
              }, 200)
            }}><button className='w-full tracking-widest font-medium text-sm'>IR A LA TIENDA</button></Link>
          </>
      }
    </div>
  )
}
