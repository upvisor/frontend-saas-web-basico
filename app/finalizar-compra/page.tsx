"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Shipping } from '../../components/products'
import { Button2 } from '../../components/ui'
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
  const [details, setDetails] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [domain, setDomain] = useState('')
  const [storeData, setStoreData] = useState<IStoreData>()
  const [rotate, setRotate] = useState('rotate-90')
  const [saveData, setSaveData] = useState(false)
  const [contactView, setContactView] = useState('hidden')
  const [contactOpacity, setContactOpacity] = useState('opacity-0')
  const [contactMouse, setContactMouse] = useState(false)
  const [shippingView, setShippingView] = useState('hidden')
  const [shippingOpacity, setShippingOpacity] = useState('opacity-0')
  const [shippingMouse, setShippingMouse] = useState(false)
  const [clientId, setClientId] = useState('')
  const [link, setLink] = useState('')

  const { data: session, status } = useSession()
  const {cart, setCart} = useContext(CartContext)

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string }

  const router = useRouter()

  const detailsRef = useRef<HTMLDivElement>(null)

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
        if (typeof window !== 'undefined') {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/information`, { cart: cart, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
          fbq('track', 'AddPaymentInfo', {contents: cart?.map(product => ({ id: product._id, quantity: product.quantity, category: product.category.category, item_price: product.price, title: product.name })), currency: "clp", value: cart!.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping), content_ids: cart?.map(product => product._id), event_id: res.data._id})
        }
      }
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

  useEffect(() => {
    if (detailsRef.current) {
      setDetails(rotate === '-rotate-90' ? detailsRef.current.scrollHeight : 0)
    }
  }, [rotate])

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

  const payChange = (e: any) => {
    setSell({...sell, state: 'No pagado', [e.target.name]: e.target.value})
  }

  const shippingChange = (e: any) => {
    setSell({ ...sell, shippingMethod: e.target.className, shipping: e.target.value, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(e.target.value) })
  }

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
    <>
      <Head>
        <title>Finalizar compra</title>
      </Head>
      <div onClick={() => {
        if (!contactMouse) {
          setContactOpacity('opacity-0')
          setTimeout(() => {
            setContactView('hidden')
          }, 200)
        }
      }} className={`${contactView} ${contactOpacity} transition-opacity duration-200 w-full h-full fixed z-50 bg-black/20`}>
        <div onMouseEnter={() => setContactMouse(true)} onMouseLeave={() => setContactMouse(false)} className={`m-auto p-6 bg-white flex flex-col gap-4 rounded-md shadow-md max-w-[500px] w-full`}>
          <h2 className='text-xl font-medium tracking-widest'>EDITAR DATOS DE CONTACTO</h2>
          <div className='flex gap-2'>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Nombre</p>
              <input type='text' placeholder='Nombre' name='firstName' onChange={inputChange} value={sell.firstName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Apellido</p>
              <input type='text' placeholder='Apellido' name='lastName' onChange={inputChange} value={sell.lastName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Teléfono</p>
            <div className='flex gap-2'>
              <span className='mt-auto mb-auto text-sm'>+56</span>
              <input type='text' placeholder='Teléfono' name='phone' onChange={inputChange} value={sell.phone} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
          </div>
          <button onClick={(e: any) => {
            e.preventDefault()
            setContactOpacity('opacity-0')
            setTimeout(() => {
              setContactView('hidden')
            }, 200)
          }} className='w-full bg-main text-white h-10 tracking-widest font-medium'>GUARDAR DATOS</button>
        </div>
      </div>
      <div onClick={() => {
        if (!shippingMouse) {
          setShippingOpacity('opacity-0')
          setTimeout(() => {
            setShippingView('hidden')
          }, 200)
        }
      }} className={`${shippingView} ${shippingOpacity} transition-opacity duration-200 w-full h-full fixed z-50 bg-black/20`}>
        <div onMouseEnter={() => setShippingMouse(true)} onMouseLeave={() => setShippingMouse(false)} className={`m-auto p-6 bg-white flex flex-col gap-4 rounded-md shadow-md max-w-[500px] w-full`}>
          <h2 className='text-xl font-medium tracking-widest'>EDITAR DIRECCIÓN DE ENVÍO</h2>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Dirección</p>
            <input type='text' placeholder='Dirección' name='address' onChange={inputChange} value={sell.address} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Deptartamento</p>
            <input type='text' placeholder='Departamento (Opcional)' name='details' onChange={inputChange} value={sell.details} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
          </div>
          <Shipping setShipping={setShipping} sell={sell} setSell={setSell} />
          <button onClick={(e: any) => {
            e.preventDefault()
            setShippingOpacity('opacity-0')
            setTimeout(() => {
              setShippingView('hidden')
            }, 200)
          }} className='w-full bg-main text-white h-10 tracking-widest font-medium'>GUARDAR DATOS</button>
        </div>
      </div>
      <div className='fixed top-[51px] bg-[#F5F5F5] w-full border border-[#F5F5F5] p-4 shadow-md block xl:hidden dark:bg-neutral-800 dark:border-neutral-700'>
        <button className='text-[14px] mb-4 flex gap-2' onClick={() => {
          if (rotate === 'rotate-90') {
            setRotate('-rotate-90')
          } else {
            setRotate('rotate-90')
          }
        }}>{<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className={`${rotate} transition-all duration-150 m-auto w-4 text-lg text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>} resumen del pedido</button>
        <div ref={detailsRef} className={`mb-2`} style={{ maxHeight: `${details}px`, overflow: 'hidden', transition: 'max-height 0.2s' }}>
          <div className='border-b mb-2 pb-1 dark:border-neutral-700'>
            <h2 className='text-[16px] font-medium tracking-widest mb-2 md:text-[18px]'>CARRITO</h2>
            {
              cart?.length !== 0
                ? cart?.map(product => (
                  <div className='flex gap-2 justify-between mb-2' key={product._id}>
                    <div className='flex gap-2'>
                      <Image className='w-20 h-20 m-auto border rounded-md p-1 dark:border-neutral-700' src={product.image} alt={product.name} width={80} height={80} />
                      <div className='mt-auto mb-auto'>
                        <span className='font-medium'>{product.name}</span>
                        <span className='block'>Cantidad: {product.quantity}</span>
                        {
                          product.variation
                            ? <span className='block'>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}</span>
                            : ''
                        }
                      </div>
                    </div>
                    <div className='flex gap-2 mt-auto mb-auto'>
                      <span className='font-medium'>${NumberFormat(product.quantityOffers?.length ? offer(product) : product.price * product.quantity)}</span>
                      {
                        product.beforePrice
                          ? <span className='text-sm line-through'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                          : ''
                      }
                    </div>
                  </div>
                ))
                : ''
            }
          </div>
          <div className='pb-3 border-b dark:border-neutral-700'>
            <h2 className='mb-2 font-medium tracking-widest text-[16px] md:text-[18px]'>CUPON DE DESCUENTO</h2>
            <div className='flex gap-2'>
              <input type='text' placeholder='Cupon' className='border text-[14px] p-1.5 rounded w-52 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
              <Button2>AGREGAR</Button2>
            </div>
          </div>
          <div className='mt-2 mb-2 pb-2 border-b dark:border-neutral-700'>
            <div className='flex gap-2 justify-between mb-1'>
              <span className='text-[14px]'>Subtotal</span>
              <span className='text-[14px]'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
            </div>
            <div className='flex gap-2 justify-between'>
              <span className='text-[14px]'>Envío</span>
              <span className='text-[14px]'>${NumberFormat(Number(sell.shipping))}</span>
            </div>
          </div>
        </div>
        <div className='flex gap-2 justify-between'>
          <span className='font-medium'>Total</span>
          <span className='font-medium'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping))}</span>
        </div>
      </div>
      <div className='mt-28 flex p-4 xl:mt-0'>
        <form className='w-[1600px] m-auto block xl:flex' id='formBuy'>
          <div className='w-full flex flex-col gap-6 pr-0 xl:w-7/12 xl:pr-8'>
            <h1 className='text-[20px] tracking-widest font-semibold md:text-[25px] dark:text-white'>FINALIZAR COMPRA</h1>
            {
              status === 'authenticated'
                ? (
                  <>
                    <div className='flex flex-col gap-2'>
                      <h2 className='text-[16px] tracking-widest font-medium md:text-[18px] dark:text-white'>INFORMACIÓN DE CONTACTO</h2>
                      <div className='bg-neutral-100 p-4 flex gap-2 justify-between dark:bg-neutral-800'>
                        <div className='flex flex-col gap-2'>
                          <p>Nombre: {sell?.firstName ? sell.firstName : 'Se necesita ingresar un nombre'}</p>
                          <p>Apellido: {sell?.lastName ? sell.lastName : 'Se necesita ingresar un apellido'}</p>
                          <p>Email: {sell?.email}</p>
                          <p>Teléfono: {sell?.phone ? sell.phone : 'Se necesita un numero de teléfono'}</p>
                        </div>
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setContactView('flex')
                          setTimeout(() => {
                            setContactOpacity('opacity-1')
                          }, 50)
                        }}>Editar datos</button>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <h2 className='text-[16px] tracking-widest font-medium md:text-[18px] dark:text-white'>DIRECCIÓN DE ENVÍO</h2>
                      <div className='bg-neutral-100 p-4 flex gap-2 justify-between dark:bg-neutral-800'>
                        <div className='flex flex-col gap-2'>
                          <p>Dirección: {sell?.address ? sell.address : 'Se nececita una dirección'}</p>
                          <p>Detalles: {sell?.details ? sell.details : '-'}</p>
                          <p>Región: {sell?.region ? sell.region : 'Se necesita una región'}</p>
                          <p>Ciudad: {sell?.city ? sell.city : 'Se necesita una ciudad'}</p>
                        </div>
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setShippingView('flex')
                          setTimeout(() => {
                            setShippingOpacity('opacity-1')
                          }, 50)
                        }}>Editar datos</button>
                      </div>
                    </div>
                  </>
                )
                : (
                  <>
                    <div className='flex flex-col gap-4'>
                      <h2 className='text-[16px] tracking-widest font-medium md:text-[18px] dark:text-white'>INFORMACIÓN DE CONTACTO</h2>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Email</p>
                        <input type='email' placeholder='Email' name='email' onChange={inputChange} value={sell.email} className='border p-1.5 rounded w-full text-sm focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        <div className='flex gap-2'>
                          <input type='checkbox' checked={sell.subscription} onChange={(e: any) => e.target.checked ? setSell({...sell, subscription: true}) : setSell({...sell, subscription: false})} />
                          <span className='text-sm text-neutral-400'>Suscribirse a nuestra lista de emails</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <h2 className='tracking-widest font-medium text-[16px] md:text-[18px] dark:text-white'>DIRECCIÓN DE ENVÍO</h2>
                      <div className='flex gap-2'>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p className='text-sm'>Nombre</p>
                          <input type='text' placeholder='Nombre' name='firstName' onChange={inputChange} value={sell.firstName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p className='text-sm'>Apellido</p>
                          <input type='text' placeholder='Apellido' name='lastName' onChange={inputChange} value={sell.lastName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Dirección</p>
                        <input type='text' placeholder='Dirección' name='address' onChange={inputChange} value={sell.address} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Departamento (Opcional)</p>
                        <input type='text' placeholder='Departamento' name='details' onChange={inputChange} value={sell.details} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      </div>
                      <Shipping setShipping={setShipping} sell={sell} setSell={setSell} />
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Teléfono</p>
                        <div className='flex gap-2'>
                          <span className='mt-auto mb-auto text-sm'>+56</span>
                          <input type='text' placeholder='Teléfono' name='phone' onChange={inputChange} value={sell.phone} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                      </div>
                    </div>
                  </>
                )
            }
            {
              shipping !== undefined
                ? (
                  <div className='flex flex-col gap-4'>
                    <h2 className='tracking-widest font-medium text-[16px] md:text-[18px] dark:text-white'>ENVÍO</h2>
                    <div className='flex flex-col gap-2'>
                      {
                        shipping.map(item => (
                          <div className='flex gap-2 justify-between p-2 border rounded-md dark:border-neutral-700' key={item.serviceDescription}>
                            <div className='flex gap-2'>
                              <input type='radio' name='shipping' className={item.serviceDescription} value={item.serviceValue} onChange={shippingChange} />
                              <p className='text-sm mt-auto mb-auto'>{item.serviceDescription}</p>
                            </div>
                            <p className='text-sm'>${NumberFormat(Number(item.serviceValue))}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
                : ''
            }
            {
              sell.shippingMethod
                ? (
                  <div className='flex flex-col gap-4'>
                    <h2 className='text-[16px] tracking-widest font-medium md:text-[18px] dark:text-white'>PAGO</h2>
                    <div className='flex flex-col gap-2'>
                      <div className='flex gap-2 p-2 border rounded-md dark:border-neutral-700'>
                        <input type='radio' name='pay' value='WebPay Plus' onChange={inputChange} />
                        <p className='text-sm'>WebPay Plus</p>
                      </div>
                      <div className='flex gap-2 p-2 border rounded-md dark:border-neutral-700'>
                        <input type='radio' name='pay' value='MercadoPago' onChange={inputChange} />
                        <p className='text-sm'>MercadoPago</p>
                      </div>
                    </div>
                  </div>
                )
                : ''
            }
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
            <div className='flex gap-2 justify-between mt-auto mb-auto'>
              <div className='mt-auto mb-auto'><Link href='/carrito'><span className='flex gap-2 text-sm'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="mt-auto mb-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>Regresar al carrito</span></Link></div>
              {
                sell.pay === ''
                  ? <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 rounded bg-button/50 tracking-widest font-medium text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                  : sell.pay === 'WebPay Plus'
                    ? (
                      <form action={url} method="POST" id='formTransbank'>
                        <input type="hidden" name="token_ws" value={token} />
                        <button onClick={transbankSubmit} className='w-28 h-10 bg-button transition-all duration-200 border rounded border-button hover:bg-transparent tracking-widest font-medium text-white cursor-pointer hover:text-button'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                      </form>
                    )
                    : sell.pay === 'MercadoPago'
                      ? link !== ''
                        ? <button onClick={mercadoSubmit} className='w-28 h-10 rounded bg-button tracking-widest font-medium transition-all duration-200 border border-button hover:bg-transparent text-white hover:text-button'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                        : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 tracking-widest rounded font-medium bg-button/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                      : sell.pay === 'Pago en la entrega'
                        ? <button onClick={handleSubmit} className='w-28 h-10 rounded bg-button tracking-widest font-medium transition-all duration-200 border border-button hover:bg-transparent text-white hover:text-button'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
                        : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 tracking-widest rounded font-medium bg-button/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'PAGAR'}</button>
              }
            </div>
          </div>
          <div className='w-5/12 h-fit border rounded-lg border-[#F5F5F5] p-6 hidden sticky top-28 bg-[#F5F5F5] dark:border-neutral-700 dark:bg-neutral-800 xl:block'>
            <div className='mb-2 pb-2 border-b dark:border-neutral-700'>
              <h2 className='mb-2 font-medium tracking-widest text-[18px] dark:text-white'>CARRITO</h2>
              {
                cart?.length !== 0
                  ? cart?.map(product => (
                    <div className='flex gap-2 justify-between mb-2' key={product._id}>
                      <div className='flex gap-2'>
                        <Image className='w-20 h-auto border rounded-md p-1 dark:border-neutral-700' src={product.image} alt={product.name} width={80} height={80} />
                        <div className='mt-auto mb-auto'>
                          <span className='block font-medium'>{product.name.toLocaleUpperCase()}</span>
                          <span className='block'>Cantidad: {product.quantity}</span>
                          {
                            product.variation
                              ? <span className='block'>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}</span>
                              : ''
                          }
                        </div>
                      </div>
                      <div className='flex gap-2 mt-auto mb-auto'>
                        <span className='font-medium'>${NumberFormat(product.quantityOffers?.length ? offer(product) : product.price * product.quantity)}</span>
                        {
                          product.beforePrice
                            ? <span className='text-sm line-through'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                            : ''
                        }
                      </div>
                    </div>
                  ))
                  : ''
              }
            </div>
            <div className='mb-2 pb-3 border-b dark:border-neutral-700'>
              <h2 className='mb-2 tracking-widest font-medium text-[18px] dark:text-white'>CUPON DE DESCUENTO</h2>
              <div className='flex gap-2'>
                <input type='text' placeholder='Cupon' className='border p-1 rounded text-[14px] w-72 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                <Button2>AGREGAR</Button2>
              </div>
            </div>
            <div className='mb-2 pb-2 border-b dark:border-neutral-700'>
              <div className='flex gap-2 justify-between mb-1'>
                <span className='text-[14px]'>Subtotal</span>
                <span className='text-[14px]'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='text-[14px]'>Envío</span>
                <span className='text-[14px]'>${NumberFormat(Number(sell.shipping))}</span>
              </div>
            </div>
            <div className='flex gap-2 justify-between'>
              <span className='font-medium'>Total</span>
              <span className='font-medium'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping))}</span>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CheckOut