"use client"
import CartContext from '@/context/cart/CartContext'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect, useContext } from 'react'
import { ProductList, ShippingCart } from '../../components/products'
import { ICartProduct, IDesign, IProduct } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { H1, LinkButton } from '../ui'

const CartPage = ({ design, products }: { design: IDesign, products: IProduct[] }) => {

  const {cart, setCart} = useContext(CartContext)

  const [shippingCost, setShippingCost] = useState(0)
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])
  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: [] }

  const filterProducts = () => {
    if (products.length) {
      if (design.home?.products.sectionProducts === 'Productos en oferta') {
        const filterProducts = products.filter(product => product.beforePrice)
        setProductsFiltered(filterProducts)
      } else {
        setProductsFiltered(products)
      }
    }
  }

  useEffect(() => {
    filterProducts()
  }, [products])

  return (
    <>
      <Head>
        <title>Carrito</title>
      </Head>
      <div className='p-4 flex'>
        <div className='m-auto w-[1600px] flex flex-col gap-4'>
          <H1>Carrito</H1>
          <div className='block gap-8 xl:flex'>
            <div className='w-full xl:w-7/12'>
              {
                cart?.length
                  ? cart?.map((product) => (
                    <div className='flex gap-4 mb-2 justify-between' key={product._id}>
                      <div className='flex gap-2'>
                        <Link href={`/productos/${product.slug}`}>
                          <Image className='w-28 h-auto rounded-md 450:w-32' src={product.image} alt={product.name} width={128} height={128} />
                        </Link>
                        <div className='mt-auto mb-auto'>
                          <Link href={`/productos/${product.slug}`}>
                            <p className='dark:text-white'>{product.name}</p>
                          </Link>
                          <div className='flex gap-2'>
                            {
                              product.quantityOffers && product.quantity > 1
                                ? <span className='font-medium'>${NumberFormat(offer(product))}</span>
                                : <span className='font-medium'>${NumberFormat(product.price * product.quantity)}</span>
                            }
                            {
                              product.beforePrice
                                ? <span className='text-sm line-through dark:text-neutral-400'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                                : ''
                            }
                          </div>
                          {
                            product.variation
                              ? <span className='dark:text-neutral-400'>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}</span>
                              : ''
                          }
                        </div>
                      </div>
                      <div className='flex gap-4'>
                        <div className='flex border rounded-md border-button w-fit h-fit mt-auto mb-auto'>
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
                            : <button className='pt-1 pb-1 pl-2 pr-3 text-button/50 cursor-not-allowed'>+</button>
                          }
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
                    </div>
                  ))
                  : (
                    <div>
                      <p className='mb-4'>No tienes productos agregados al carrito</p>
                      <Link href='/tienda' className='py-2 px-6 border font-medium tracking-wide border-main transition-colors duration-200 rounded bg-main text-white text-sm hover:bg-transparent hover:text-main'>IR A LA TIENDA</Link>
                    </div>
                  )
              }
            </div>
            {
              cart?.length
                ? (
                  <div className='w-full xl:w-5/12'>
                    <div className='bg-[#F5F5F5] rounded-md p-4 border border-[#F5F5F5] 450:p-6 dark:bg-neutral-800 dark:border-neutral-700'>
                      <div className='mb-2 pb-2 border-b dark:border-neutral-700'>
                        <div className='mb-4 border-b pb-4 dark:border-neutral-700'>
                          <ShippingCart setShippingCost={setShippingCost} />
                        </div>
                        <div className='flex gap-2 justify-between mb-1'>
                          <span className='text-[14px] dark:text-neutral-400'>Subtotal</span>
                          {
                            cart?.length
                              ? <span className='text-[14px]'>${NumberFormat(cart.reduce((bef, curr) => curr.quantityOffers ? offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
                              : ''
                          }
                        </div>
                        <div className='flex gap-2 justify-between'>
                          <span className='text-[14px] dark:text-neutral-400'>Envío</span>
                          <span className='text-[14px]'>${NumberFormat(shippingCost)}</span>
                        </div>
                      </div>
                      <div className='flex gap-2 justify-between'>
                        <span className='font-medium'>Total</span>
                        {
                          cart?.length
                            ? <span className='font-medium'>${NumberFormat(cart.reduce((bef, curr) => curr.quantityOffers ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(shippingCost))}</span>
                            : ''
                        }
                      </div>
                      <div className='mt-3 ml-auto w-full flex'>
                        <LinkButton config='w-full text-[16px]' url={'/finalizar-compra'}>Finalizar compra</LinkButton>
                      </div>
                    </div>
                  </div>
                )
                : ''
            }
          </div>
        </div>
      </div>
      {
        productsFiltered.length
            ? <ProductList products={ productsFiltered } title={design.cart?.title && design.cart?.title !== '' ? design.cart.title : 'Productos recomendados'} />
            : ''
      }
    </>
  )
}

export default CartPage