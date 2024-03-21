"use client"
import CartContext from '@/context/cart/CartContext'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect, useContext } from 'react'
import { ProductList, ShippingCart } from '../../components/products'
import { IDesign, IProduct } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import Image from 'next/image'
import { H1, LinkButton } from '../ui'
import { Quantity } from '.'

const CartPage = ({ design, products }: { design: IDesign, products: IProduct[] }) => {

  const {cart} = useContext(CartContext)

  const [shippingCost, setShippingCost] = useState(0)
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])

  const filterProducts = () => {
    if (products.length) {
      setProductsFiltered(products)
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
        <div className='m-auto w-[1360px] flex flex-col gap-4'>
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
                      <Quantity product={product} />
                    </div>
                  ))
                  : (
                    <div>
                      <p className='mb-4'>No tienes productos agregados al carrito</p>
                      <Link href='/tienda' className='py-2 px-6 border tracking-wide border-main transition-colors duration-200 rounded-md bg-main text-white text-sm hover:bg-transparent hover:text-main'>Ir a la tienda</Link>
                    </div>
                  )
              }
            </div>
            {
              cart?.length
                ? (
                  <div className='w-full xl:w-5/12'>
                    <div className='bg-gray-50 p-6 border 450:p-6 dark:bg-neutral-800 dark:border-neutral-700'>
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
            ? <ProductList products={ productsFiltered } title='Productos recomendados' />
            : ''
      }
    </>
  )
}

export default CartPage