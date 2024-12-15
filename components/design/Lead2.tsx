"use client"
import React, { useState } from 'react'
import { Button, Check, H1, H2, Input, Select } from '../ui'
import { IClient, IDesign, IForm, IStoreData } from '@/interfaces'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'

declare const fbq: Function

export const Lead2 = ({ content, forms, index, storeData, style }: { content: IDesign, forms: IForm[], index: any, storeData: IStoreData, style?: any }) => {

  const [client, setClient] = useState<IClient>({ email: '', tags: forms.find(form => form._id === content.form)?.tags, forms: [{ form: forms.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='w-full m-auto flex py-8 px-4 md:py-12' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='flex flex-col gap-4 w-full max-w-[1280px] mx-auto'>
        {
          content.info.titleForm === 'Logo principal' && storeData.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        <H1 text={content.info.title} config="text-center font-semibold" color={content.info.textColor} />
        <H2 text={content.info.description} config="text-center font-medium text-xl lg:text-2xl" color={content.info.textColor} />
        <div className='flex gap-3 m-auto'>
          <Check config='my-auto' />
          <p className="text-lg lg:text-xl" style={{ color: content.info.textColor }}>{content.info.subTitle}</p>
        </div>
        <div className='flex gap-3 m-auto'>
          <Check config='my-auto' />
          <p className="text-lg lg:text-xl" style={{ color: content.info.textColor }}>{content.info.subTitle2}</p>
        </div>
        <div className='flex gap-3 m-auto'>
          <Check config='my-auto' />
          <p className="text-lg lg:text-xl" style={{ color: content.info.textColor }}>{content.info.subTitle3}</p>
        </div>
        <div className={`w-full flex`}>
          {
            content.form && content.form !== ''
              ? ''
              : (
                <div className="flex flex-col gap-4 border border-black/5 rounded-xl h-fit m-auto w-full p-6 max-w-[500px]" style={{ boxShadow: '0px 3px 10px 3px #11111108' }}>
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
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: client.phone, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), service: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, funnel: client.funnels?.length && client.funnels[0].funnel !== '' ? client.funnels[0].funnel : undefined, step: client.funnels?.length && client.funnels[0].step !== '' ? client.funnels[0].step : undefined, page: pathname, eventId: newEventId })
                    fbq('track', 'Lead', { first_name: client.firstName, last_name: client.lastName, email: client.email, phone: client.phone && client.phone !== '' ? `56${client.phone}` : undefined, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), content_name: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, contents: { id: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, quantity: 1 }, event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                    if (form?.action === 'Ir a una pagina') {
                      router.push(form.redirect!)
                    } else if (form?.action === 'Mostrar mensaje') {
                      setMessage(form.message!)
                    }
                  }
                }}>
                  <div className={`${style.design === 'Borde' ? 'border' : ''} ${style.form === 'Redondeadas' ? 'rounded-2xl' : ''} flex flex-col gap-4 h-fit m-auto w-full p-6 md:p-8 max-w-[500px] bg-white`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '' }}>
                    {
                      error !== ''
                        ? <p className='w-fit px-2 py-1 bg-red-500 text-white m-auto'>{error}</p>
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
                        <div key={label.data} className="flex flex-col gap-2">
                          <p>{label.text !== '' ? label.text : label.name}</p>
                          {
                            label.type === 'Texto'
                              ? (
                                <Input
                                  style={style}
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
                              )
                              : ''
                          }
                          {
                            label.type === 'Selector'
                              ? (
                                <Select selectChange={(e: any) => {
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
                                }} value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}>
                                  <option>Seleccionar opción</option>
                                  {
                                    label.datas?.map(data => <option key={data}>{data}</option>)
                                  }
                                </Select>
                              )
                              : ''
                          }
                        </div>
                      ))
                    }
                    <Button type='submit' config='w-full' loading={loading} style={style}>{forms?.find(form => form._id === content.form)?.button}</Button>
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
