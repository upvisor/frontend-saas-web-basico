"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, Calendar, Input } from '../ui'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { Design, ICall, IClient, IForm, IPayment } from '@/interfaces'
import Cookies from 'js-cookie'

declare const fbq: Function

interface Props {
    popup: any
    setPopup: any
    content: string
    design: Design
    forms: IForm[]
}

export const PopupPage: React.FC<Props> = ({ popup, setPopup, content, design, forms }) => {

  const [message, setMessage] = useState('')
  const [clientData, setClientData] = useState<IClient>({ email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const popupRef = useRef<any>(null);
    
  const router = useRouter()
  const pathname = usePathname()

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
    <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full top-0 fixed bg-black/30 flex z-50 px-4`}>
        {
          content === 'Abrir popup'
            ? (
              <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} transition-transform duration-200 w-full p-6 md:p-8 rounded-2xl max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col gap-4`} style={{ boxShadow: '0px 3px 20px 3px #11111120' }}>
                {
                  message !== ''
                    ? <p>{message}</p>
                    : (
                      <>
                        {
                          design?.popup?.title && design.popup.title !== ''
                            ? <h2 className='text-2xl font-medium'>{design.popup.title}</h2>
                            : ''
                        }
                        {
                          design?.popup?.description && design.popup.description !== ''
                            ? <p>{design.popup.description}</p>
                            : ''
                        }
                        {
                          design?.popup?.content && design.popup.content !== ''
                            ? forms?.find(form => form._id === content)
                                ? (
                                  <form className="flex w-full" onSubmit={async (e: any) => {
                                    e.preventDefault()
                                    if (!loading) {
                                      setLoading(true)
                                      setError('')
                                      const form = forms.find(form => form._id === content)
                                      let valid = true
                                      let errorMessage = ''
                                      form?.labels.forEach(label => {
                                        if (label.data && (!clientData[label.data] || clientData[label.data].trim() === '')) {
                                          valid = false
                                          errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                                        }
                                      })
                                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                      if (clientData.email && !emailRegex.test(clientData.email)) {
                                        valid = false
                                        errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                                      }
                                      if (!valid) {
                                        setError(errorMessage)
                                        setLoading(false)
                                        return
                                      }
                                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, clientData)
                                      const newEventId = new Date().getTime().toString()
                                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, { firstName: clientData.firstName, lastName: clientData.lastName, email: clientData.email, phone: clientData.phone, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), service: clientData.services?.length && clientData.services[0].service !== '' ? clientData.services[0].service : undefined, funnel: clientData.funnel, step: clientData.funnel?.step, page: pathname, eventId: newEventId })
                                      fbq('track', 'Lead', { first_name: clientData.firstName, last_name: clientData.lastName, email: clientData.email, phone: clientData.phone && clientData.phone !== '' ? `56${clientData.phone}` : undefined, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), content_name: clientData.services?.length && clientData.services[0].service !== '' ? clientData.services[0].service : undefined, contents: { id: clientData.services?.length && clientData.services[0].service !== '' ? clientData.services[0].service : undefined, quantity: 1 }, event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                                      if (form?.action === 'Ir a una pagina') {
                                        router.push(form.redirect!)
                                      } else if (form?.action === 'Mostrar mensaje') {
                                        setMessage(form.message!)
                                      }
                                      setLoading(false)
                                    }
                                  }}>
                                    <div className="flex flex-col gap-4 h-fit m-auto w-full p-6 md:p-8 max-w-[500px]">
                                      {
                                        message !== ''
                                          ? <p className='text-lg text-center font-medium'>{message}</p>
                                          : (
                                            <>
                                              {
                                                error !== ''
                                                  ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                  : ''
                                              }
                                              <p className="text-main text-xl font-medium text-center">{forms?.find(form => form._id === content)?.title}</p>
                                              {
                                                forms?.find(form => form._id === content)?.informations.map(information => (
                                                  <div key={information.text} className="flex gap-2">
                                                    <div
                                                      className="my-auto"
                                                      dangerouslySetInnerHTML={{ __html: information.icon }}
                                                    />
                                                    <div className="flex flex-col my-auto">
                                                      <p>{information.text}</p>
                                                      {
                                                        information.subText && information.subText !== ''
                                                          ? <p className="text-gray-400">{information.subText}</p>
                                                          : ''
                                                      }
                                                    </div>
                                                  </div>
                                                ))
                                              }
                                              {
                                                forms?.find(form => form._id === content)?.labels.map(label => (
                                                  <div key={label._id} className="flex flex-col gap-2">
                                                    <p>{label.text !== '' ? label.text : label.name}</p>
                                                    <Input
                                                      placeholder={label.name}
                                                      value={clientData.data?.find((dat: any) => dat.name === label.name)?.value || clientData[label.data]}
                                                      inputChange={(e: any) => {
                                                        if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                                          setClientData({ ...clientData, [label.data]: e.target.value })
                                                        } else if (Array.isArray(clientData.data)) {
                                                          const oldData = [...clientData.data];
                                                          const existingData = oldData.find(dat => dat.name === label.name);
                  
                                                          if (existingData) {
                                                            existingData.value = e.target.value;
                                                          } else {
                                                            oldData.push({ name: label.data, value: e.target.value });
                                                          }
                  
                                                          setClientData({ ...clientData, data: oldData });
                                                        } else {
                                                          setClientData({ ...clientData, data: [{ name: label.data, value: e.target.value }] });
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                ))
                                              }
                                              <Button type='submit' config='w-full' loading={loading}>{forms?.find(form => form._id === content)?.button}</Button>
                                            </>
                                          )
                                      }
                                    </div>
                                  </form>
                                )
                                : ''
                            : ''
                        }
                      </>
                    )
                }
              </div>
            )
            : forms.find(form => form._id === content)
                ? (
                  <form ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} transition-transform duration-200 flex flex-col gap-4 border rounded-2xl h-fit m-auto p-6 md:p-8 w-full max-w-[600px] bg-white`} style={{ boxShadow: '0px 3px 20px 3px #11111120' }} onSubmit={async (e: any) => {
                    e.preventDefault()
                    if (!loading) {
                      setLoading(true)
                      setError('')
                      let valid = true
                      let errorMessage = ''
                      forms.find(form => form._id === content)?.labels.forEach(label => {
                        if (label.data && (!clientData[label.data] || clientData[label.data].trim() === '')) {
                          valid = false
                          errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                        }
                      })
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      if (clientData.email && !emailRegex.test(clientData.email)) {
                        valid = false
                        errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                      }
                      if (!valid) {
                        setError(errorMessage)
                        setLoading(false)
                        return
                      }
                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, clientData)
                      if (forms.find(form => form._id === content)?.action === 'Ir a una pagina') {
                        router.push(forms.find(form => form._id === content)?.redirect!)
                      } else if (forms.find(form => form._id === content)?.action === 'Mostrar mensaje') {
                        setMessage(forms.find(form => form._id === content)?.message!)
                      }
                      setLoading(false)
                    }
                  }}>
                    {
                      message !== ''
                        ? <p className='text-lg text-center font-medium'>{message}</p>
                        : (
                          <>
                            {
                              error !== ''
                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                : ''
                            }
                            <p className="text-main text-xl font-medium text-center">{forms?.find(form => form._id === content)?.title}</p>
                            {
                              forms?.find(form => form._id === content)?.informations.map(information => (
                                <div key={information.text} className="flex gap-2">
                                  <div
                                    className="my-auto"
                                    dangerouslySetInnerHTML={{ __html: information.icon }}
                                  />
                                  <div className="flex flex-col my-auto">
                                    <p>{information.text}</p>
                                    {
                                      information.subText && information.subText !== ''
                                        ? <p className="text-gray-400">{information.subText}</p>
                                        : ''
                                    }
                                  </div>
                                </div>
                              ))
                            }
                            {
                              forms?.find(form => form._id === content)?.labels.map(label => (
                                <div key={label._id} className="flex flex-col gap-2">
                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                  <Input
                                    placeholder={label.name}
                                    value={clientData.data?.find((dat: any) => dat.name === label.name)?.value || clientData[label.data]}
                                    inputChange={(e: any) => {
                                      if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                        setClientData({ ...clientData, [label.data]: e.target.value })
                                      } else if (Array.isArray(clientData.data)) {
                                        const oldData = [...clientData.data];
                                        const existingData = oldData.find(dat => dat.name === label.name);

                                        if (existingData) {
                                          existingData.value = e.target.value;
                                        } else {
                                          oldData.push({ name: label.data, value: e.target.value });
                                        }

                                        setClientData({ ...clientData, data: oldData });
                                      } else {
                                        setClientData({ ...clientData, data: [{ name: label.data, value: e.target.value }] });
                                      }
                                    }}
                                  />
                                </div>
                              ))
                            }
                            <Button type='submit' config='w-full' loading={loading}>{forms?.find(form => form._id === content)?.button}</Button>
                          </>
                        )
                    }
                  </form>
                )
                : ''
        }
      </div>
  )
}
