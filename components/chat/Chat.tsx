"use client"
import { City, ICartProduct, IMessage, IProduct, IShipping, Region } from '@/interfaces'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'
import { Input, Select, Spinner2 } from '../ui'
import { ButtonCart, Quantity } from '.'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import styles from  "../home/Products.module.css"
import Image from 'next/image'
import { NumberFormat, offer } from '@/utils'
import Cookies from 'js-cookie'

declare const fbq: Function

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`)

export const Chat = () => {

  const [tempCartProducts, setTempCartProducts] = useState<ICartProduct[]>()
  const [chatOpacity, setChatOpacity] = useState('-mb-[700px]')
  const [chat, setChat] = useState<IMessage[]>([{
    agent: false,
    response: '¡Hola! Mi nombre es Maaibot y soy un asistente virtual de la tienda Maaide, ¿En que te puedo ayudar?. Si en algun momento necesitas hablar con un agente escribe "agente" en el chat y si quieres realizar una compra escribe "compra" en el chat',
    adminView: false,
    userView: false
  }])
  const [newMessage, setNewMessage] = useState('')
  const [products, setProducts] = useState<IProduct[]>()
  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()
  const [shipping, setShipping] = useState<IShipping[]>()
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [link, setLink] = useState('')

  const chatRef = useRef(chat)
  const containerRef = useRef<HTMLDivElement>(null)
  const chatOpacityRef = useRef(chatOpacity)

  const getMessages = async () => {
    if (localStorage.getItem('chatId')) {
      const senderId = localStorage.getItem('chatId')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${senderId}`)
      setChat(response.data)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  const getProducts = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
    setProducts(res.data)
    setTempCartProducts(res.data.map((product: IProduct) => ({
      _id: product._id,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      beforePrice: product.beforePrice,
      slug: product.slug,
      quantity: 1,
      stock: product.stock,
      category: product.category,
      quantityOffers: product.quantityOffers
    })))
  }

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    chatRef.current = chat
  }, [chat])

  useEffect(() => {
    chatOpacityRef.current = chatOpacity
  }, [chatOpacity])

  useEffect(() => {
    socket.on('messageAdmin', message => {
      if (localStorage.getItem('chatId') === message.senderId) {
        if (chatOpacityRef.current === '') {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: true }]))
        } else {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: false }]))
        }
      }
    })

    return () => {
      socket.off('messageAdmin', message => console.log(message))
    }
  }, [])

  const inputChange = (e: any) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chat])

  const requestRegions = async () => {
    const request = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
      }
    })
    setRegions(request.data.regions)
  }

  useEffect(() => {
    requestRegions()
  }, [])

  const regionChange = async (e: any) => {
    const region = regions?.find(region => region.regionName === e.target.value)
    const request = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
      }
    })
    setCitys(request.data.coverageAreas)
    let senderId
    let message = e.target.value
    let ultimateMessage = [...chat]
    ultimateMessage.reverse()
    setNewMessage('')
    setChat(chat.concat({agent: false, message: message, userView: true}))
    if (localStorage.getItem('chatId')) {
      senderId = localStorage.getItem('chatId')
    } else {
      senderId = uuidv4()
      localStorage.setItem('chatId', senderId)
    }
    let response
    socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 7, email: localStorage.getItem('email')})
    response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 7, email: localStorage.getItem('email')})
    if (response!.data.response) {
      setChat(chat.filter(mes => mes.message === message))
    }
    setChat(chat.concat(response!.data))
  }

  const cityChange = async (e: any) => {
    const city = citys?.find(city => city.countyName === e.target.value)
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
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COTIZADOR
      }
    })
    setShipping(request.data.data.courierServiceOptions)
    let senderId
    let message = e.target.value
    let ultimateMessage = [...chat]
    ultimateMessage.reverse()
    setNewMessage('')
    setChat(chat.concat({agent: false, message: message, userView: true}))
    if (localStorage.getItem('chatId')) {
      senderId = localStorage.getItem('chatId')
    } else {
      senderId = uuidv4()
      localStorage.setItem('chatId', senderId)
    }
    let response
    socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 8, email: localStorage.getItem('email')})
    response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 8, email: localStorage.getItem('email')})
    if (response!.data.response) {
      setChat(chat.filter(mes => mes.message === message))
    }
    setChat(chat.concat(response!.data))
  }

  const submitMessage = async (e: any) => {
    e.preventDefault()
    let senderId
    let message = newMessage
    let ultimateMessage = [...chat]
    ultimateMessage.reverse()
    setNewMessage('')
    setChat(chat.concat({agent: false, message: message, userView: true}))
    if (localStorage.getItem('chatId')) {
      senderId = localStorage.getItem('chatId')
    } else {
      senderId = uuidv4()
      localStorage.setItem('chatId', senderId)
    }
    let response
    if (ultimateMessage[0].shop) {
      if (ultimateMessage[0].shop === 1) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 1, email: localStorage.getItem('email'), saveData: localStorage.getItem('saveData')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true, shop: 1, email: localStorage.getItem('email'), saveData: localStorage.getItem('saveData') })
      } else if (ultimateMessage[0].shop === 1.5) {
        if (message === 'datos anteriores') {
          const region = regions?.find(region => region.regionName === Cookies.get('region'))
          const req = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
            }
          })
          const citys = req.data.coverageAreas
          const city = citys?.find((city: any) => city.countyName === Cookies.get('city'))
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
              'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COTIZADOR
            }
          })
          setShipping(request.data.data.courierServiceOptions)
          socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 8, email: localStorage.getItem('email')})
          response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { message: message, senderId: senderId, adminView: false, userView: true, shop: 8, email: localStorage.getItem('email') })
        } else {
          socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 1, email: localStorage.getItem('email')})
          response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true, shop: 1, email: localStorage.getItem('email') })
        }
      } else if (ultimateMessage[0].shop === 2) {
        localStorage.setItem('email', message)
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 2, email: localStorage.getItem('email')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 2, email: localStorage.getItem('email')})
      } else if (ultimateMessage[0].shop === 3) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 3, email: localStorage.getItem('email')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 3, email: localStorage.getItem('email')})
      } else if (ultimateMessage[0].shop === 4) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 4, email: localStorage.getItem('email')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 4, email: localStorage.getItem('email')})
      } else if (ultimateMessage[0].shop === 5) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 5, email: localStorage.getItem('email')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 5, email: localStorage.getItem('email')})
      } else if (ultimateMessage[0].shop === 6) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 6, email: localStorage.getItem('email')})
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 6, email: localStorage.getItem('email')})
      }
    } else {
      socket.emit('message', {message: message, senderId: senderId, createdAt: new Date()})
      if (chat.length === 1) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/create`, { senderId: senderId, response: chat[0].response, agent: false, adminView: false, userView: true })
      }
      response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true })
    }
    if (response!.data.response) {
      setChat(chat.filter(mes => mes.message === message))
    }
    setChat(chat.concat(response!.data))
  }

  const transbankSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitLoading(true)
    const cart = JSON.parse(localStorage.getItem('cart')!)
    cart.map(async (product: ICartProduct) => {
      if (product.variation) {
        if (product.subVariation) {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation, subVariation: product.subVariation })
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation })
        }
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity })
      }
    })
    const ship = localStorage.getItem('shipping')
    fbq('track', 'InitiateCheckout', {contents: cart, currency: "CLP", value: cart.reduce((bef: any, curr: any) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(ship)})
    const form = document.getElementById('formTransbank') as HTMLFormElement
    localStorage.setItem('chat', '')
    localStorage.setItem('chatId', '')
    if (form) {
      form.submit()
    }
  }

  const mercadoSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitLoading(true)
    const cart = JSON.parse(localStorage.getItem('cart')!)
    cart.map(async (product: ICartProduct) => {
      if (product.variation) {
        if (product.subVariation) {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation, subVariation: product.subVariation })
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: -product.quantity, variation: product.variation })
        }
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, { stock: product.quantity })
      }
    })
    const ship = localStorage.getItem('shipping')
    fbq('track', 'InitiateCheckout', {contents: cart, currency: "CLP", value: cart.reduce((bef: any, curr: any) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(ship)})
    localStorage.setItem('chat', '')
    localStorage.setItem('chatId', '')
    window.location.href = link
  }

  return (
    <>
        <div className={`${chatOpacity} fixed bottom-24 right-4 flex z-40 h-[480px] ml-3 justify-between flex-col gap-3 transition-all duration-500 bg-white shadow-md rounded-xl dark:bg-main w-96 sm:h-[600px] sm:gap-4`}>
          <div className='h-28 w-full shadow-md bg-main rounded-t-xl flex p-4'>
            <span className='text-white mt-auto mb-auto text-xl'>Maaibot</span>
          </div>
          <div ref={containerRef} className='flex flex-col h-full gap-2 pl-3 sm:pl-4' style={{ overflow: 'overlay' }}>
            {
              chat?.length
                ? chat.map(info => (
                  <div key={info.response} className='flex flex-col gap-2 pr-3 sm:pr-4'>
                    {
                      info.message
                        ? (
                          <div className='flex flex-col gap-2 ml-6'>
                            <div className='bg-button text-white p-1.5 rounded-md w-fit ml-auto'><p>{info.message}</p></div>
                          </div>
                        )
                        : ''
                    }
                    {
                      info.response
                        ? (
                          <div className='flex flex-col gap-2 mr-6'>
                            <div className='bg-main text-white p-1.5 rounded-md w-fit'><p>{info.response}</p></div>
                            <div>
                            {
                              info.shop === 1 && tempCartProducts?.length
                                ? (
                                  <Swiper
                                    className={styles.mySwiper}
                                    slidesPerView={2}
                                    pagination={{
                                      clickable: true,
                                    }}
                                    modules={[Pagination]}
                                  >
                                    {
                                      products?.map((product, index) => (
                                        <SwiperSlide className='m-auto w-40 pb-8 p-1' key={product._id}>
                                          <Image className='w-40 mb-1' src={product.images[0].url} alt={`Imagen producto ${product.name}`} width={500} height={500} />
                                          <p className='font-medium mb-1'>{product.name}</p>
                                          <div className='flex gap-2 mb-1'>
                                            <p>${NumberFormat(product.price)}</p>
                                            {
                                              product.beforePrice
                                                ? <p className='text-sm line-through'>${NumberFormat(product.beforePrice)}</p>
                                                : ''
                                            }
                                          </div>
                                          {
                                            product.variations?.variations[0].variation !== ''
                                              ? (
                                                <Select selectChange={(e: any) => {
                                                  const tempProducts = [...tempCartProducts]
                                                  let vari: string = ''
                                                  let subVari: string = ''
                                                  if (e.target.value.includes(' / ')) {
                                                    const variation = e.target.value.split(' / ')
                                                    vari = variation[0]
                                                    subVari = variation[1]
                                                  } else {
                                                    vari = e.target.value
                                                  }
                                                  const variationSelect = product.variations?.variations.find(variation => variation.variation === vari)
                                                  tempProducts[index].variation = variationSelect
                                                  if (subVari !== '') {
                                                    tempProducts[index].subVariation = variationSelect?.subVariation
                                                  }
                                                  setTempCartProducts(tempProducts)
                                                }} config='w-full mb-1'>
                                                  <option>Seleccionar</option>
                                                  {
                                                    product.variations?.variations.map(variation => (
                                                      <option key={variation.variation}>{variation.variation}{variation.subVariation && variation.subVariation !== '' ? ` / ${variation.subVariation}` : ''}</option>
                                                    ))
                                                  }
                                                </Select>
                                              )
                                              : ''
                                          }
                                          <Quantity currentValue={tempCartProducts[index].quantity!} maxValue={tempCartProducts[index].stock!} updatedQuantity={(quantity: number) => {
                                            const beforeCartProducts = [...tempCartProducts]
                                            beforeCartProducts[index].quantity = quantity
                                            setTempCartProducts(beforeCartProducts)
                                          }} />
                                          <ButtonCart tempCartProduct={tempCartProducts[index]}></ButtonCart>
                                        </SwiperSlide> 
                                      ))
                                    }
                                  </Swiper>
                                )
                                : ''
                            }
                            {
                              info.shop === 2
                                ? (
                                  <div className='flex gap-2'>
                                    <input type='checkbox' onChange={(e: any) => e.target.checked ? localStorage.setItem('saveData', 'true') : localStorage.setItem('saveData', 'false')} />
                                    <p>Guardar datos para comprar más rapido la proxima vez</p>
                                  </div>
                                )
                                : ''
                            }
                            {
                              info.shop === 7
                                ? (
                                  <Select selectChange={regionChange}>
                                    <option>Seleccionar Región</option>
                                    {
                                      regions !== undefined
                                        ? regions.map(region => <option key={region.regionId}>{region.regionName}</option>)
                                        : ''
                                    }
                                  </Select>
                                )
                                : ''
                            }
                            {
                              info.shop === 8
                                ? (
                                  <Select selectChange={cityChange}>
                                    <option>Seleccionar Ciudad</option>
                                    {
                                      citys !== undefined
                                        ? citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)
                                        : ''
                                    }
                                  </Select>
                                )
                                : ''
                            }
                            {
                              info.shop === 9
                                ? (
                                  <div className='flex flex-col gap-2'>
                                    {
                                      shipping?.map(service => (
                                        <div key={service.serviceDescription} className='flex justify-between p-2 border rounded-md dark:border-neutral-600'>
                                          <div className='flex gap-2'>
                                            <input type='radio' onClick={async () => {
                                              let senderId
                                              let message = service.serviceDescription
                                              let ultimateMessage = [...chat]
                                              ultimateMessage.reverse()
                                              setNewMessage('')
                                              setChat(chat.concat({agent: false, message: message, userView: true}))
                                              localStorage.setItem('shipping', service.serviceValue)
                                              if (localStorage.getItem('chatId')) {
                                                senderId = localStorage.getItem('chatId')
                                              } else {
                                                senderId = uuidv4()
                                                localStorage.setItem('chatId', senderId)
                                              }
                                              let response
                                              socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 9, email: localStorage.getItem('email'), shipping: service.serviceValue, shippingState: 'No empaquetado', cart: JSON.parse(localStorage.getItem('cart')!), fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc')})
                                              response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 9, email: localStorage.getItem('email'), shipping: service.serviceValue, shippingState: 'No empaquetado', cart: JSON.parse(localStorage.getItem('cart')!), fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc')})
                                              if (response!.data.response) {
                                                setChat(chat.filter(mes => mes.message === message))
                                              }
                                              setChat(chat.concat(response!.data))
                                              const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${localStorage.getItem('email')}`)
                                              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, { 
                                                firstName: res.data.firstName,
                                                lastName: res.data.lastName,
                                                email: res.data.email,
                                                address: res.data.address,
                                                departament: res.data.departament,
                                                region: res.data.region,
                                                city: res.data.city,
                                                cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')!) : [],
                                                shipping: service.serviceValue,
                                                pay: '',
                                                state: 'Pedido realizado',
                                                total: JSON.parse(localStorage.getItem('cart')!).reduce((bef: any, curr: any) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(localStorage.getItem('shipping')),
                                                fbp: Cookies.get('_fbp'),
                                                fbc: Cookies.get('_fbc'),
                                                shippingMethod: message,
                                                shippingState: 'No empaquetado',
                                                subscription: false,
                                                phone: res.data.phone
                                              })
                                            }} />
                                            <span className='text-sm text-[#444444] dark:text-neutral-400'>{service.serviceDescription}</span>
                                          </div>
                                          <span className='text-sm'>${NumberFormat(Number(service.serviceValue))}</span>
                                        </div>
                                      ))
                                    }
                                  </div>
                                )
                                : ''
                            }
                            {
                              info.shop === 10
                                ? (
                                  <Select selectChange={async (e: any) => {
                                    let senderId
                                    let message = e.target.value
                                    let ultimateMessage = [...chat]
                                    ultimateMessage.reverse()
                                    setNewMessage('')
                                    setChat(chat.concat({agent: false, message: message, userView: true}))
                                    if (localStorage.getItem('chatId')) {
                                      senderId = localStorage.getItem('chatId')
                                    } else {
                                      senderId = uuidv4()
                                      localStorage.setItem('chatId', senderId)
                                    }
                                    if (e.target.value === 'Webpay') {
                                      const cart = JSON.parse(localStorage.getItem('cart')!)
                                      const ship = localStorage.getItem('shipping')
                                      const pago = {
                                        amount: cart.reduce((bef: any, curr: any) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(ship),
                                        returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
                                      }
                                      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/create`, pago)
                                      setToken(response.data.token)
                                      setUrl(response.data.url)
                                    } else if (e.target.value === 'MercadoPago') {
                                      let products: any[] = []
                                      const cart = JSON.parse(localStorage.getItem('cart')!)
                                      const ship = localStorage.getItem('shipping')
                                      cart.map((product: ICartProduct) => {
                                        products = products.concat({ title: product.name, unit_price: product.price, quantity: product.quantity })
                                      })
                                      products = products.concat({ title: 'Envío', unit_price: Number(ship), quantity: 1 })
                                      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago-create`, products)
                                      setLink(res.data.init_point)
                                    }
                                    let response
                                    socket.emit('message', {message: message, senderId: senderId, createdAt: new Date(), shop: 10, email: localStorage.getItem('email')})
                                    response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true , shop: 9, email: localStorage.getItem('email')})
                                    if (response!.data.response) {
                                      setChat(chat.filter(mes => mes.message === message))
                                    }
                                    setChat(chat.concat(response!.data))
                                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sell/${localStorage.getItem('email')}`)
                                    localStorage.setItem('sell', JSON.stringify(res.data))
                                    if (localStorage.getItem('saveData') === 'true') {
                                      Cookies.set('firstName', res.data.firstName)
                                      Cookies.set('lastName', res.data.lastName)
                                      Cookies.set('email', res.data.email)
                                      if (res.data.phone) {
                                        Cookies.set('phone', res.data.phone.toString())
                                      }
                                      Cookies.set('address', res.data.address)
                                      if (res.data.details) {
                                        Cookies.set('details', res.data.details)
                                      }
                                      Cookies.set('city', res.data.city)
                                      Cookies.set('region', res.data.region)
                                    }
                                  }}>
                                    <option>Selecciona el metodo de pago</option>
                                    <option>Webpay</option>
                                    <option>MercadoPago</option>
                                  </Select>
                                )
                                : ''
                            }
                            {
                              info.shop === 11
                                ? (
                                  <>
                                    {
                                      link !== ''
                                        ? <button onClick={mercadoSubmit} className='w-28 h-10 rounded-md bg-button transition-all duration-200 border border-button hover:bg-transparent text-white hover:text-button'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                                        : ''
                                    }
                                    {
                                      token !== '' && url !== ''
                                        ? (
                                          <form action={url} method="POST" id='formTransbank'>
                                            <input type="hidden" name="token_ws" value={token} />
                                            <button onClick={transbankSubmit} className='w-28 h-10 bg-button transition-all duration-200 border rounded-md border-button hover:bg-transparent text-white cursor-pointer hover:text-button'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                                          </form>
                                        )
                                        : ''
                                    }
                                  </>
                                )
                                : ''
                            }
                            </div>
                          </div>
                        )
                        : ''
                    }
                  </div>
                ))
                : ''
            }
          </div>
          <form className='flex gap-2 pr-3 pl-3 pb-3 sm:pr-4 sm:pl-4 sm:pb-4'>
            <Input inputChange={inputChange} value={newMessage} type={'text'} placeholder={'Mensaje'} />
            <button type='submit' onClick={submitMessage} className='bg-main text-white w-28 rounded-md dark:bg-neutral-700 border border-main transition-colors duration-200 hover:bg-transparent hover:text-main'>Enviar</button>
          </form>
        </div>
        <button onClick={async (e: any) => {
          e.preventDefault()
          if (chatOpacity === '-mb-[700px]') {
            setTimeout(() => {
              setChatOpacity('')
            }, 50)
          } else {
            setChatOpacity('-mb-[700px]')
          }
          const senderId = localStorage.getItem('chatId')
          if (senderId) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/chat-user/${senderId}`)
            getMessages()
          } else {
            chat[0].userView = true
            setChat(chat)
          }
        }} className='w-14 h-14 z-50 bg-main flex rounded-full fixed bottom-4 right-4 ml-auto shadow-md'>
          {
            chatOpacity === '-mb-[700px]'
              ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-3xl text-white m-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"></path>
                </svg>
              )
              : (
                <svg className="m-auto w-[19px] text-white" role="presentation" viewBox="0 0 16 14">
                  <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                </svg>
              )
          }
          {
            chat.map((message, index) => (
              <div key={index}>
                {
                  index === chat.length - 1
                    ? message.userView
                        ? ''
                        : <div className='h-3 w-3 rounded-full bg-button right-0 absolute' />
                    : ''
                  }
              </div>
            ))
          }
        </button>
    </>
  )
}
