"use client"
import React, { useEffect, useState } from 'react'
import { Button, Check, H1, H2, Input, P } from '../ui'
import { IClient, IDesign, IForm, IService } from '@/interfaces'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

declare const fbq: Function

export const Lead1 = ({ content, forms, step, index, services }: { content: IDesign, forms: IForm[], step?: string, index: any, services?: IService[] }) => {

  const [client, setClient] = useState<IClient>({ email: '', tags: forms.find(form => form._id === content.form)?.tags, forms: [{ form: forms.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState([])

  const router = useRouter()
  const pathname = usePathname()

  const getFunnel = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
      const service = services?.find(service => service._id === respo.data.service)
      if (res.data) {
        setClient({ ...client, funnels: [{ funnel: respo.data._id, step: stepFind._id }], services: service?._id ? [{ service: service?._id }] : undefined })
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    getFunnel()
  }, [step])

  const getClientData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-data`)
    setData(res.data)
  }

  useEffect(() => {
    getClientData()
  }, [])

  return (
    <div className='w-full flex py-8 px-4 md:py-12' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className="flex flex-col gap-8 m-auto w-full max-w-[1280px] lg:flex-row">
        <div className='w-full flex flex-col gap-4 my-auto lg:w-1/2'>
          {
            content.info.description2 && content.info.description2 !== ''
              ? <p className='text-white bg-main px-4 py-2 w-fit text-base lg:text-lg'>{content.info.description2}</p>
              : ''
          }
          <H1 text={content.info.title} color={content.info.textColor} />
          <P text={content.info.description} color={content.info.textColor} />
          <div className='flex gap-3'>
            <Check config='my-auto' />
            <P text={content.info.subTitle} color={content.info.textColor} />
          </div>
          <div className='flex gap-3'>
            <Check config='my-auto' />
            <P text={content.info.subTitle2} color={content.info.textColor} />
          </div>
          <div className='flex gap-3'>
            <Check config='my-auto' />
            <P text={content.info.subTitle3} color={content.info.textColor} />
          </div>
        </div>
        <div className='w-full flex lg:w-1/2'>
          {
            content.form && content.form !== ''
              ? ''
              : (
                <div className='p-6 md:p-8 rounded-2xl border border-black/5 my-auto w-full max-w-[500px]' style={{ boxShadow: '0px 3px 20px 3px #11111110' }}>
                  <p>Selecciona un formulario</p>
                </div>
              )
          }
          {
            content.form && content.form !== ''
              ? (
                <form className="flex w-full" onSubmit={async (e: any) => {
                  e.preventDefault()
                  if (!loading) {
                    setLoading(true)
                    setError('')
                    const form = forms.find(form => form._id === content.form)
                    let valid = true
                    let errorMessage = ''
                    form?.labels.forEach(label => {
                      if (label.data && (!client[label.data] || client[label.data].trim() === '')) {
                        valid = false
                        errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                      }
                    })
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (client.email && !emailRegex.test(client.email)) {
                      valid = false
                      errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                    }
                    if (!valid) {
                      setError(errorMessage)
                      setLoading(false)
                      return
                    }
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, client)
                    const newEventId = new Date().getTime().toString()
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: client.phone, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), service: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, funnel: client.funnel, step: client.funnel?.step, page: pathname, eventId: newEventId })
                    fbq('track', 'Lead', { first_name: client.firstName, last_name: client.lastName, email: client.email, phone: client.phone && client.phone !== '' ? `56${client.phone}` : undefined, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), content_name: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, contents: { id: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, quantity: 1 }, event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                    if (form?.action === 'Ir a una pagina') {
                      router.push(form.redirect!)
                    } else if (form?.action === 'Mostrar mensaje') {
                      setMessage(form.message!)
                    }
                  }
                }}>
                  <div className="flex flex-col gap-4 border border-black/5 rounded-xl h-fit m-auto w-full p-6 max-w-[500px]" style={{ boxShadow: '0px 3px 10px 3px #11111108' }}>
                    {
                      message !== ''
                        ? <p className='text-lg text-center font-medium'>{message}</p>
                        : (
                          <>
                            {
                              error !== ''
                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit m-auto'>{error}</p>
                                : ''
                            }
                            <p className="text-main text-xl font-medium text-center">{forms?.find(form => form._id === content.form)?.title}</p>
                            {
                              forms?.find(form => form._id === content.form)?.informations.map(information => (
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
                              forms?.find(form => form._id === content.form)?.labels.map(label => (
                                <div key={label._id} className="flex flex-col gap-2">
                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                  <Input
                                    placeholder={label.name}
                                    value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}
                                    inputChange={(e: any) => {
                                      if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                        setClient({ ...client, [label.data]: e.target.value })
                                      } else if (Array.isArray(client.data)) {
                                        const oldData = [...client.data];
                                        const existingData = oldData.find(dat => dat.name === label.name);
                                        if (existingData) {
                                          existingData.value = e.target.value;
                                        } else {
                                          oldData.push({ name: label.data, value: e.target.value });
                                        }

                                        setClient({ ...client, data: oldData });
                                      } else {
                                        setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                      }
                                    }}
                                  />
                                </div>
                              ))
                            }
                            <Button type='submit' config='w-full' loading={loading}>{forms?.find(form => form._id === content.form)?.button}</Button>
                          </>
                        )
                    }
                  </div>
                </form>
              )
              : ''
          }
        </div>
      </div>
    </div>
  )
}
