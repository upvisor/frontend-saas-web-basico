import { ISell } from '@/interfaces'
import { offer } from '@/utils'
import axios from 'axios'
import Link from 'next/link'
import router from 'next/router'
import React, { useState } from 'react'
import { Spinner2 } from '../ui'
import Cookies from 'js-cookie'

declare const fbq: Function

export const ButtonPay = ({ sell, clientId, saveData, token, link, url }: { sell: ISell, clientId: string, saveData: any, token: string, link: string, url: string }) => {

    const [submitLoading, setSubmitLoading] = useState(false)

    const transbankSubmit = async (e: any) => {
        e.preventDefault()
        setSubmitLoading(true)
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
        if (clientId !== '') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
        }
        localStorage.setItem('sell', JSON.stringify(data))
        sell.cart.map(async (product) => {
          if (product.variation) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity, variation: product.variation })
          } else {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity })
          }
        })
        if (saveData) {
          Cookies.set('firstName', sell.firstName)
          Cookies.set('lastName', sell.lastName)
          Cookies.set('email', sell.email)
          if (sell.phone) {
            Cookies.set('phone', sell.phone.toString())
          }
          Cookies.set('address', sell.address)
          if (sell.details) {
            Cookies.set('details', sell.details)
          }
          Cookies.set('city', sell.city)
          Cookies.set('region', sell.region)
        }
        fbq('track', 'InitiateCheckout', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
        const form = document.getElementById('formTransbank') as HTMLFormElement
        if (form) {
          form.submit()
        }
      }
    
      const handleSubmit = async (e: any) => {
        e.preventDefault()
        setSubmitLoading(true)
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
        if (clientId !== '') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
        }
        localStorage.setItem('sell', JSON.stringify(data))
        sell.cart.map(async (product) => {
          if (product.variation) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity, variation: product.variation })
          } else {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity })
          }
        })
        if (saveData) {
          Cookies.set('firstName', sell.firstName)
          Cookies.set('lastName', sell.lastName)
          Cookies.set('email', sell.email)
          if (sell.phone) {
            Cookies.set('phone', sell.phone.toString())
          }
          Cookies.set('address', sell.address)
          if (sell.details) {
            Cookies.set('details', sell.details)
          }
          Cookies.set('city', sell.city)
          Cookies.set('region', sell.region)
        }
        fbq('track', 'Purchase', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
        router.push('/gracias-por-comprar')
        setSubmitLoading(false)
      }
    
      const mercadoSubmit = async (e: any) => {
        e.preventDefault()
        setSubmitLoading(true)
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
        if (clientId !== '') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
        }
        localStorage.setItem('sell', JSON.stringify(data))
        sell.cart.map(async (product) => {
          if (product.variation) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity, variation: product.variation })
          } else {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity })
          }
        })
        if (saveData) {
          Cookies.set('firstName', sell.firstName)
          Cookies.set('lastName', sell.lastName)
          Cookies.set('email', sell.email)
          if (sell.phone) {
            Cookies.set('phone', sell.phone.toString())
          }
          Cookies.set('address', sell.address)
          if (sell.details) {
            Cookies.set('details', sell.details)
          }
          Cookies.set('city', sell.city)
          Cookies.set('region', sell.region)
        }
        fbq('track', 'InitiateCheckout', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
        window.location.href = link
        setSubmitLoading(false)
      }

  return (
    <div className='flex gap-2 justify-between mt-auto mb-auto'>
              <div className='mt-auto mb-auto'><Link href='/carrito'><span className='flex gap-2 text-sm'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="mt-auto mb-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>Regresar al carrito</span></Link></div>
              {
                sell.pay === ''
                  ? <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 rounded-md bg-button/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                  : sell.pay === 'WebPay Plus'
                    ? (
                      <form action={url} method="POST" id='formTransbank'>
                        <input type="hidden" name="token_ws" value={token} />
                        <button onClick={transbankSubmit} className='w-28 h-10 bg-button transition-all duration-200 border rounded-md border-button hover:bg-transparent text-white cursor-pointer hover:text-button'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                      </form>
                    )
                    : sell.pay === 'MercadoPago'
                      ? link !== ''
                        ? <button onClick={mercadoSubmit} className='w-28 h-10 rounded-md bg-button transition-all duration-200 border border-button hover:bg-transparent text-white hover:text-button'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                        : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 rounded-md bg-button/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                      : sell.pay === 'Pago en la entrega'
                        ? <button onClick={handleSubmit} className='w-28 h-10 rounded-md bg-button transition-all duration-200 border border-button hover:bg-transparent text-white hover:text-button'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                        : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 rounded-md bg-button/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
              }
            </div>
  )
}
