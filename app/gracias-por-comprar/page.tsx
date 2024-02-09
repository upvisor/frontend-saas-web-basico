"use client"
import { ISell } from '@/interfaces'
import { offer } from '@/utils'
import axios from 'axios'
import React, { useEffect } from 'react'

declare const fbq: Function

const PageBuySuccess = () => {

  const updateClient = async () => {
    if (localStorage.getItem('sell')) {
      const sell: ISell = JSON.parse(localStorage.getItem('sell')!)
      fbq('track', 'Purchase', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { email: sell.email, firstName: sell.firstName, lastName: sell.lastName, phone: sell.phone, address: sell.address, departament: sell.details, region: sell.region, city: sell.city, tags: ['Clientes'] })
      localStorage.setItem('sell', '')
      localStorage.setItem('cart', '')
    }
  }

  useEffect(() => {
    updateClient()
  }, [])

  return (
    <div className='flex px-2'>
      <div className='w-full max-w-[1600px] m-auto py-20 flex flex-col gap-4'>
        <h1 className='text-4xl font-medium'>Tu compra se ha realizado correctamente</h1>
        <p className='text-lg'>Recibiras un correo con el detalle de tu pedido</p>
      </div>
    </div>
  )
}

export default PageBuySuccess