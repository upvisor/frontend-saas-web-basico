"use client"
import { IContactData, IInfo } from '@/interfaces'
import axios from 'axios'
import React, { useState } from 'react'
import { ButtonSubmit, H1, H2, H3, Input, P, Textarea } from '../ui'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'

declare const fbq: Function

export const ContactPage = ({ info, index }: { info: IInfo, index: any }) => {

  const [formContact, setFormContact] = useState<IContactData>({
    name: '',
    email: '',
    message: '',
    images: []
  })
  const [sending, setSending] = useState('Enviar')
  const [error, setError] = useState('')

  const pathname = usePathname()

  const inputChange = (e: any) => {
    setFormContact({ ...formContact, [e.target.name]: e.target.value })
  }

  const imageChange = (e: any) => {
    let images: any = formContact.images
    const files = Array.from(e.target.files)
    files.map(async (file: any) => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('name', file.name)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/image`, formData, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8'
        }
      })
      images = images.concat(response.data)
    })
    setFormContact({...formContact, images: images})
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (sending !== '') {
      setSending('')
      setError('')
      if (formContact.name !== '' && formContact.email !== '' && formContact.message !== '') {
        if (emailRegex.test(formContact.email)) {
          const newEventId = new Date().getTime().toString()
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, { ...formContact, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), page: pathname, eventId: newEventId })
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client`, { firstName: formContact.name, email: formContact.email, tags: ['formulario-contacto'] })
          fbq('track', 'Contact', { first_name: formContact.name, email: formContact.email, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
          setSending('Mensaje enviado')
          setFormContact({name: '', email: '', message: '', images: []})
          setTimeout(() => {
            setSending('Enviar')
          }, 3000)
        } else {
          setSending('Enviar')
          setError('Ingresaste un correo no valido')
        }
      } else {
        setSending('Enviar')
        setError('No has llenado todos los datos necesarios')
      }
    }
  }

  return (
      <div className='flex px-4' style={{ background: `${info.typeBackground === 'Degradado' ? info.background : info.typeBackground === 'Color' ? info.background : ''}` }}>
        <div className='m-auto w-[1280px] py-8 block gap-16 xl:flex md:py-12'>
          <div className='w-full m-auto flex flex-col gap-2 mb-10 xl:w-1/2 xl:mb-auto'>
            {
              index === 0
                ? <H1 text={info.title} color={info.textColor} />
                : <H2 text={info.title} color={info.textColor} />
            }
            <P text={info.description} color={info.textColor} />
          </div>
          <div className='w-full m-auto sm:w-[560px] xl:w-1/2'>
            <div className='rounded-xl border border-black/5 flex flex-col gap-4 p-6 sm:p-8 dark:shadow-none' style={{ boxShadow: '0px 3px 10px 3px #11111108' }}>
              {
                error !== ''
                  ? <p className='bg-red-500 px-2 py-1 text-white w-fit'>{error}</p>
                  : ''
              }
              <H3 text={info.titleForm} config='font-medium' />
              <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm'>Nombre</p>
                  <Input inputChange={inputChange} value={formContact.name} type={'text'} placeholder={'Nombre'} name='name' text='text-sm' />
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm'>Email</p>
                  <Input inputChange={inputChange} value={formContact.email} type={'text'} placeholder={'Email'} name='email' text='text-sm' />
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm'>Mensaje</p>
                  <Textarea placeholder='Mensaje' name='message' change={inputChange} value={formContact.message} />
                </div>
                <input type='file' onChange={imageChange} className='text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-main/10 file:text-main hover:file:bg-main/20 dark:file:bg-neutral-600 dark:file:text-white' />
                <ButtonSubmit submitLoading={sending === ''} textButton={sending} action={handleSubmit} />
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}
