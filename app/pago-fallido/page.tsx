"use client"
import { ICartProduct } from '@/interfaces'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function PageBuyError () {

  const updatedStock = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')!)
    cart.map(async (product: ICartProduct) => {
      if (product.variation) {
        if (product.variation.subVariation) {
          if (product.variation.subVariation2) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation.variation, subVariation: product.variation.subVariation, subVariation2: product.variation.subVariation2 })
          } else {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation.variation, subVariation: product.variation.subVariation })
          }
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation.variation })
        }
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity })
      }
    })
  }

  useEffect(() => {
    updatedStock()
  }, [])

  return (
    <div className='flex px-2'>
      <div className='w-full max-w-[1360px] m-auto py-20 flex flex-col gap-4'>
        <h1 className='text-4xl font-medium'>Ha habido un error con el pago</h1>
        <p className='text-lg'>Lamentablemente el pago de tu compra ha fallado, puedes volver a intentarlo haciendo clic en el siguiente boton</p>
        <Link href='/finalizar-compra' className='px-6 py-1.5 border border-button transition-colors duration-200 w-fit rounded-md bg-button flex text-white hover:bg-transparent hover:text-button'><p className='m-auto'>Volver a intentarlo</p></Link>
      </div>
    </div>
  )
}