"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { H3, H4, Input, Spinner } from '../ui'
import { NumberFormat } from '@/utils';
import { IClient, IDesign, IPayment, IService, IStoreData } from '@/interfaces';
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react'
import axios from 'axios';
import { io } from 'socket.io-client'
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie'
import Link from 'next/link';
import Image from 'next/image'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

interface Props {
    content: IDesign
    services?: IService[]
    step?: string
    payment?: IPayment
    storeData: IStoreData
}

declare global {
    interface Window {
      MercadoPago: any;
      cardPaymentBrickController: any;
    }
}

declare const fbq: Function

export const Checkout: React.FC<Props> = ({ content, services, step, payment, storeData }) => {

  const [client, setClient] = useState<IClient>({ email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialization, setInitialization] = useState({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '') })
  const [idService, setIdService] = useState('')
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const clientRef = useRef(client);
  const initializationRef = useRef(initialization)
  const paymentIdRef = useRef(null)

  const pathname = usePathname()

  initMercadoPago(payment?.mercadoPago.publicKey!)

  const viewCheckout = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
    if (!res.data.message) {
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      const params = new URLSearchParams(url.search)
      const email = params.get('email')
      const serviceId = params.get('service')
      setIdService(serviceId? serviceId : '')
      if (email && serviceId) {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pay-email/${email}-${serviceId}`)
        setInitialization({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price) })
        initializationRef.current.amount = Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
      }
      const service = services?.find(servi => servi._id === content.service?.service)
      const newEventId = new Date().getTime().toString()
      if (pathname !== '/') {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, funnel: respo.data._id, step: stepFind?._id, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, eventId: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
    } else {
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      const params = new URLSearchParams(url.search)
      const email = params.get('email')
      const serviceId = params.get('service')
      setIdService(serviceId? serviceId : '')
      if (email && serviceId) {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pay-email/${email}-${serviceId}`)
        setInitialization({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price) })
        initializationRef.current.amount = Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] }
      }
      const service = services?.find(servi => servi._id === content.service?.service)
      const newEventId = new Date().getTime().toString()
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
      fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fbq === 'function') {
        viewCheckout()
        clearInterval(interval)
      }
    }, 100)
  
    return () => clearInterval(interval)
  }, [])
   
  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    if (!loading) {
      setLoading(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
        if (emailRegex.test(clientRef.current.email)) {
          return new Promise<void>((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/process_payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then(async (response) => {
                console.log(response)
                paymentIdRef.current = response.id
                let currentClient = clientRef.current
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago realizado' : 'Pago realizado'
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                const service = services?.find(service => service._id === content.service?.service)
                const price = Number(initializationRef.current.amount)
                const newEventId = new Date().getTime().toString()
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined })
                fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                setLoading(false)
                setPaymentCompleted(true)
                resolve();
              })
              .catch(async (error) => {
                let currentClient = clientRef.current
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago no realizado' : 'Pago no realizado'
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                reject();
              });
          })
        } else {
          setError('Has ingresado un correo invalido')
        }
      } else {
        setError('Debes llenar todos los datos')
      }
    }
  };
   
  const onError = async (error: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };
   
  const onReady = async () => {
    setLoadingPayment(false)
  };

  const cardPaymentMemo = useMemo(() => {
    // Verificar que initialization.amount sea un número y mayor que 0
    if (typeof initializationRef.current.amount === 'number' && initializationRef.current.amount > 0) {
      return (
        <CardPayment
          initialization={initializationRef.current}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      );
    }
    return null; // No renderizar CardPayment si la condición no se cumple
  }, [initializationRef.current.amount]);

  const statusScreenBrick = useMemo(() => {
    if (paymentCompleted && paymentIdRef.current) {
      return (
        <StatusScreen
          initialization={{
            paymentId: paymentIdRef.current
          }}
          customization={{
            visual: {
              hideStatusDetails: true,
              hideTransactionDate: true,
              style: {
                theme: 'default', // Cambia el tema según sea necesario
              }
            },
            backUrls: {
              error: `${process.env.NEXT_PUBLIC_WEB_URL}`,
              return: process.env.NEXT_PUBLIC_WEB_URL,
            },
          }}
          onError={(error) => console.error("Error in status screen:", error)}
        />
      )
    }
    return null
  }, [paymentCompleted, paymentIdRef.current])

  return (
    <div className='w-full flex px-4 py-8 md:py-14' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='m-auto w-full max-w-[1280px] gap-6 flex flex-col'>
        { 
          content.info.titleForm === 'Logo principal' && storeData.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        <div className='m-auto w-full max-w-[1280px] gap-8 flex flex-col md:flex-row'>
          <div className='flex flex-col gap-6 w-full md:w-3/5'>
            <div className='flex flex-col gap-4'>
              <H3 text='Datos de contacto' config='font-medium' color={content.info.textColor} />
              <div className='flex flex-col gap-2'>
                <p style={{ color: content.info.textColor }}>Email</p>
                <Input placeholder='Email' inputChange={(e: any) => {
                  setClient({ ...client, email: e.target.value })
                  clientRef.current = { ...client, email: e.target.value }
                }} value={client.email} />
              </div>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-2 w-1/2'>
                  <p style={{ color: content.info.textColor }}>Nombre</p>
                  <Input placeholder='Nombre' inputChange={(e: any) => {
                    setClient({ ...client, firstName: e.target.value })
                    clientRef.current = { ...client, firstName: e.target.value }
                  }} value={client.firstName} />
                </div>
                <div className='flex flex-col gap-2 w-1/2'>
                  <p style={{ color: content.info.textColor }}>Apellido</p>
                  <Input placeholder='Apellido' inputChange={(e: any) => {
                    setClient({ ...client, lastName: e.target.value })
                    clientRef.current = { ...client, lastName: e.target.value }
                  }} value={client.lastName} />
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <p style={{ color: content.info.textColor }}>Teléfono</p>
                <div className='flex gap-2'>
                  <p className='my-auto' style={{ color: content.info.textColor }}>+56</p>
                  <Input placeholder='Teléfono' inputChange={(e: any) => {
                    setClient({ ...client, phone: e.target.value })
                    clientRef.current = { ...client, phone: e.target.value }
                  }} value={client.phone} />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col'>
                {loadingPayment ? (
                  <div className='flex w-full h-[748px] bg-white rounded-xl'>
                    <div className='w-fit h-fit m-auto'><Spinner /></div>
                  </div>
                ) : null}
                {paymentCompleted ? statusScreenBrick : cardPaymentMemo}
                <div id="cardPaymentBrick_container"></div>
                {
                  error !== ''
                    ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                    : ''
                }
              </div>
            </div>
          </div>
          <div className='bg-white flex flex-col gap-4 sticky top-20 h-fit w-full p-6 rounded-xl border border-black/5 md:w-2/5' style={{ boxShadow: '0px 3px 10px 3px #11111108' }}>
            {
              content.service && content.service.service !== ''
                ? (
                  <>
                    <H4 text={services?.find(servi => servi._id === content.service?.service)?.name} config='font-medium' />
                    <p>{services?.find(servi => servi._id === content.service?.service)?.description}</p>
                    <p>Tipo de pago: {services?.find(servi => servi._id === content.service?.service)?.typePrice}</p>
                    {
                      initialization.amount !== null && initialization.amount !== 0
                        ? <p className='text-xl font-medium'>${NumberFormat(Number(initialization.amount))}</p>
                        : ''
                    }
                    {
                      services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan.name === content.service?.plan)
                        ? (
                          <>
                            <p>{services.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan.name === content.service?.plan)?.description}</p>
                            <p className='text-xl font-medium'>${NumberFormat(Number(services.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan.name === content.service?.plan)?.price))}</p>
                          </>
                        )
                        : ''
                    }
                  </>
                )
                : ''
            }
          </div>
        </div>
      </div>
    </div>
  )
}
