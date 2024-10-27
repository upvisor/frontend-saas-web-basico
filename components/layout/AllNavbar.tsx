"use client"
import { usePathname } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Chat } from '../chat'
import { Design, ICall, IForm, IFunnel, IPayment, IPolitics, IService, IStoreData } from '@/interfaces'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'

interface Props {
    design: Design
    storeData: IStoreData
    funnels: IFunnel[]
    politics?: IPolitics
    calls: ICall[]
    forms: IForm[]
    payment: IPayment
    services: IService[]
}

declare const fbq: Function

export const AllNavbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, funnels, politics, calls, forms, payment, services }) => {

  const [load, setLoad] = useState(false)

  const pathname = usePathname()

  const pageView = async () => {
    const funnel = funnels.find(funnel => funnel.steps.some(step => step.slug !== '' ? `/${step.slug}` === pathname : false))
    const service = services.find(service => service.steps.some(step => step.slug !== '' ? `/${step.slug}` === pathname : false))
    const newEventId = new Date().getTime().toString()
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/page`, { page: pathname, funnel: funnel?._id, step: funnel?.steps.find(step => `/${step.slug}` === pathname), service: funnel?.service ? funnel?.service : service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), eventId: newEventId })
    fbq('track', 'PageView', { content_name: funnel?.service, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
    if (!load) {
      setLoad(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/session`, { page: pathname, funnel: funnel?._id, step: funnel?.steps.find(step => `/${step.slug}` === pathname), service: funnel?.service ? funnel?.service : service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fbq === 'function') {
        pageView()
        clearInterval(interval)
      }
    }, 100)
  
    return () => clearInterval(interval)
  }, [pathname])

  return (
    <>
      {
        funnels.map(funnel => funnel.steps.find(step => step.slug && step.slug !== '' ? `/${step.slug}` === pathname : false))[0] || services.map(service => service.steps.find(step => step.slug && step.slug !== '' ? `/${step.slug}` === pathname : false))[0]
          ? (
            <div className='flex flex-col justify-between min-h-screen'>
              { children }
              <div className='w-full p-6 bg-neutral-900 flex flex-col gap-4'>
                {
                  storeData?.logoWhite
                    ? <Link href='/' target='_blank'><Image className='w-48 h-auto m-auto' src={storeData.logoWhite} alt='Logo' width={320} height={150} /></Link>
                    : <Link href='/' target='_blank' className='text-white text-3xl font-medium m-auto'>SITIO WEB</Link>
                }
                {
                  (politics?.privacy && politics.privacy !== '') || (politics?.terms && politics.terms !== '')
                    ? (
                      <div className='flex gap-4'>
                        {
                          politics.privacy && politics.privacy !== ''
                            ? <Link href='/politicas-de-privacidad'>Politicas de privacidad</Link>
                            : ''
                        }
                        {
                          politics.privacy && politics.privacy !== ''
                            ? <Link href='/terminos-y-condiciones'>Terminos y condiciones</Link>
                            : ''
                        }
                      </div>
                    )
                    : ''
                }
                <p className='text-white/70 text-sm text-center'>Este sitio no es parte del sitio web de Facebook ni de Facebook Inc. Además, este sitio NO está respaldado por Facebook de ninguna manera. FACEBOOK es una marca registrada de FACEBOOK, Inc.</p>
              </div>
            </div>
          )
          : (
            <Navbar design={design} storeData={storeData} calls={calls} forms={forms} politics={politics} payment={payment}>
                <div className="h-[50px] sm:h-[53px]" />
                { children }
                <Chat />
            </Navbar>
          )
      }
    </>
  )
}
