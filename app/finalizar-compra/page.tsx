"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Shipping } from '../../components/products'
import { Button2, H1, H2 } from '../../components/ui'
import { IClient, ISell, IShipping, IStoreData } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import Link from 'next/link'
import Head from 'next/head'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Spinner2 } from '../../components/ui'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { initMercadoPago } from '@mercadopago/sdk-react'
import CartContext from '@/context/cart/CartContext'
import { ButtonPay, Data, EditData, EditShipping, Resume, ResumePhone, ShippingPay } from '@/components/checkout'

declare const fbq: Function

const CheckOut = () => {

  const [sell, setSell] = useState<ISell>({
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    email: Cookies.get('email') || '',
    address: Cookies.get('address') || '',
    region: Cookies.get('region') || '',
    city: Cookies.get('city') || '',
    cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')!) : [],
    shipping: 0,
    pay: '',
    state: 'Pago iniciado',
    total: 0,
    fbp: Cookies.get('_fbp'),
    fbc: Cookies.get('_fbc'),
    shippingMethod: '',
    shippingState: '',
    subscription: false,
    phone: Number(Cookies.get('phone')) || undefined,
    buyOrder: ''
  })
  const [shipping, setShipping] = useState<IShipping[]>()
  const [domain, setDomain] = useState('')
  const [storeData, setStoreData] = useState<IStoreData>()
  const [saveData, setSaveData] = useState(false)
  const [contactView, setContactView] = useState('hidden')
  const [contactOpacity, setContactOpacity] = useState('opacity-0')
  const [contactMouse, setContactMouse] = useState(false)
  const [shippingView, setShippingView] = useState('hidden')
  const [shippingOpacity, setShippingOpacity] = useState('opacity-0')
  const [shippingMouse, setShippingMouse] = useState(false)
  const [clientId, setClientId] = useState('')
  const [link, setLink] = useState('')
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')

  const { data: session, status } = useSession()
  const {cart, setCart} = useContext(CartContext)

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string }

  const router = useRouter()

  initMercadoPago(process.env.MERCADOPAGO_PUBLIC_KEY!)

  const getClientData = async () => {
    if (status === 'authenticated') {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${user.email}`)
      const data: IClient = response.data
      if (data) {
        setSell({...sell, address: data.address ? data.address : '', city: data.city ? data.city : '', details: data.departament ? data.departament : '', email: data.email, firstName: data.firstName ? data.firstName : '', lastName: data.lastName ? data.lastName : '', phone: data.phone ? Number(data.phone) : undefined, region: data.region ? data.region : '', total: cart?.reduce((bef: any, curr: any) => bef + curr.price * curr.quantity, 0), cart: cart!})
        setClientId(data._id!)
      }
      if (data.city && data.region) {
        const res = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '4ebbe4e737b54bfe94307bca9e36ac4d'
          }
        })
        const regions = res.data.regions
        const region = regions?.find((region: any) => region.regionName === data.region)
        const response = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '4ebbe4e737b54bfe94307bca9e36ac4d'
          }
        })
        const citys = response.data.coverageAreas
        const city = citys?.find((city: any) => city.countyName === data.city)
        const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
          "originCountyCode": "QNOR",
          "destinationCountyCode": city?.countyCode,
          "package": {
              "weight": "5",
              "height": "30",
              "width": "30",
              "length": "30"
          },
          "productType": 3,
          "contentType": 1,
          "declaredWorth": "10000",
          "deliveryTime": 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '512b6b0ff709426d82968a33be83b4a1'
          }
        })
        setShipping(request.data.data.courierServiceOptions)
      }
    }
    if (typeof window !== 'undefined') {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/information`, { cart: cart, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
      fbq('track', 'AddPaymentInfo', {contents: cart?.map(product => ({ id: product._id, quantity: product.quantity, category: product.category.category, item_price: product.price, title: product.name })), currency: "clp", value: cart!.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping), content_ids: cart?.map(product => product._id), event_id: res.data._id})
    }
  }

  useEffect(() => {
    getClientData()
  }, [])

  const getDomain = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/domain`)
    setDomain(response.data.domain)
  }

  useEffect(() => {
    getDomain()
  }, [])

  const getStoreData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
    setStoreData(response.data)
  }

  useEffect(() => {
    getStoreData()
  }, [])

  const inputChange = async (e: any) => {
    setSell({ ...sell, [e.target.name]: e.target.value, buyOrder: `${storeData?.name ? storeData.name : 'ORDEN'}${Math.floor(Math.random() * 10000) + 1}` })
    if (e.target.name === 'pay' && e.target.value === 'WebPay Plus') {
      const pago = {
        amount: sell.total,
        returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/create`, pago)
      setToken(response.data.token)
      setUrl(response.data.url)
    } else if (e.target.name === 'pay' && e.target.value === 'MercadoPago') {
      let products: any[] = []
      sell.cart.map(product => {
        products = products.concat({ title: product.name, unit_price: product.price, quantity: product.quantity })
      })
      products = products.concat({ title: 'Envío', unit_price: Number(sell.shipping), quantity: 1 })
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago-create`, products)
      setLink(res.data.init_point)
    }
  }

  return (
    <>
      <Head>
        <title>Finalizar compra</title>
      </Head>
      <EditData contactMouse={contactMouse} setContactOpacity={setContactOpacity} setContactView={setContactView} contactView={contactView} contactOpacity={contactOpacity} setContactMouse={setContactMouse} inputChange={inputChange} sell={sell} />
      <EditShipping shippingMouse={shippingMouse} setShippingOpacity={setShippingOpacity} setShippingView={setShippingView} shippingView={shippingView} shippingOpacity={shippingOpacity} setShippingMouse={setShippingMouse} sell={sell} inputChange={inputChange} setSell={setSell} setShipping={setShipping} />
      <ResumePhone cart={cart} sell={sell} />
      <div className='mt-28 flex p-4 xl:mt-0'>
        <form className='w-[1600px] m-auto block xl:flex' id='formBuy'>
          <div className='w-full flex flex-col gap-6 pr-0 xl:w-7/12 xl:pr-8'>
            <H1>Finalizar compra</H1>
            <Data status={status} sell={sell} setContactView={setContactView} setContactOpacity={setContactOpacity} setShippingView={setShippingView} setShippingOpacity={setShippingOpacity} inputChange={inputChange} setSell={setSell} setShipping={setShipping} />
            <ShippingPay shipping={shipping} sell={sell} inputChange={inputChange} setSell={setSell} />
            {
              status === 'authenticated'
                ? ''
                : (
                  <div className='flex gap-2 mb-4'>
                    <input type='checkbox' checked={saveData} onChange={(e: any) => e.target.checked ? setSaveData(true) : setSaveData(false)} />
                    <span className='text-sm text-neutral-400'>Guardar datos para poder comprar más rapido la proxima vez</span>
                  </div>
                )
            }
            <ButtonPay sell={sell} clientId={clientId} saveData={saveData} token={token} link={link} url={url} />
          </div>
          <Resume cart={cart} sell={sell} />
        </form>
      </div>
    </>
  )
}

export default CheckOut