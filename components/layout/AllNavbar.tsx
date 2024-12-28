"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'
import { Chat } from '../chat'
import { Design, ICall, IClient, IForm, IFunnel, IPayment, IPolitics, IService, IStoreData } from '@/interfaces'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Button, Calendar, Input, LinkButton } from '../ui'

interface Props {
    design: Design
    storeData: IStoreData
    politics?: IPolitics
    forms: IForm[]
    style?: any
}

declare const fbq: Function

export const AllNavbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, politics, forms, style }) => {

  const [load, setLoad] = useState(false)
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [message, setMessage] = useState('')
  const [clientData, setClientData] = useState<IClient>({ email: '' })
  const [loadingPopup, setLoadingPopup] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const popupRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname()
  const router = useRouter()

  const pageView = async () => {
    const newEventId = new Date().getTime().toString()
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/page`, { page: pathname, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), eventId: newEventId })
    fbq('track', 'PageView', { fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
    if (!load) {
      setLoad(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/session`, { page: pathname })
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

  const getClientData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-data`)
    setData(res.data)
  }

  useEffect(() => {
    getClientData()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('popup') !== design.popup?.title) {
      setTimeout(() => {
        setPopup({ view: 'flex', opacity: 'opacity-0', mouse: false })
        setTimeout(() => {
          setPopup({ view: 'flex', opacity: 'opacity-1', mouse: false })
        }, 10)
      }, (design.popup?.wait ? design.popup?.wait * 1000 : 0));
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && popup.view === 'flex') {
        setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
        setTimeout(() => {
          setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
        }, 200)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popup, setPopup]);

  return (
    <>
      {
        design.popup?.active
          ? (
            <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full fixed bg-black/30 flex z-50 px-4`}>
              <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} max-w-[600px] transition-transform duration-200 w-full p-6 rounded-xl max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col gap-4`} style={{ boxShadow: '0px 3px 20px 3px #11111120' }}>
                {
                  message !== ''
                    ? <p>{message}</p>
                    : (
                      <>
                        {
                          design.popup.title && design.popup.title !== ''
                            ? <h2 className='text-2xl font-medium'>{design.popup.title}</h2>
                            : ''
                        }
                        {
                          design.popup.description && design.popup.description !== ''
                            ? <p>{design.popup.description}</p>
                            : ''
                        }
                        {
                          design.popup.buttonText && design.popup.buttonText !== '' && design.popup.buttonLink && design.popup.buttonLink !== ''
                            ? <Button action={(e: any) => {
                              e.preventDefault()
                              localStorage.setItem('popup', design.popup?.title!)
                              router.push(design.popup!.buttonLink!)
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                              setTimeout(() => {
                                setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
                              }, 200);
                            }}>{design.popup.buttonText}</Button>
                            : ''
                        }
                      </>
                    )
                }
              </div>
            </div>
          )
          : ''
      }
      <Navbar design={design} storeData={storeData} politics={politics} style={style}>
        <div className="h-[60px] sm:h-[60px]" />
        { children }
        {
          design.whatsapp && storeData?.phone !== ''
            ? (
              <Link area-label='Botón para abrir chat por Whatsapp' href={`https://wa.me/56${storeData?.phone}`} className='fixed bottom-20 right-4 z-50 w-14 h-14 flex bg-[#25D366] rounded-full shadow-md' target='_blank'>
              <svg className='m-auto text-white' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            </Link>
            )
            : ''
        }
        <Chat style={style} />
    </Navbar>
    </>
  )
}
