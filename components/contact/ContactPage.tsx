"use client"
import { IContactData, IInfo } from '@/interfaces'
import axios from 'axios'
import React, { useState } from 'react'
import { ButtonFunction, H1, H2, Input } from '../ui'

export const ContactPage = ({ info }: { info: IInfo }) => {

  const [formContact, setFormContact] = useState<IContactData>({
    name: '',
    email: '',
    message: '',
    images: []
  })
  const [sending, setSending] = useState('Enviar')

  const inputChange = (e: any) => {
    setFormContact({ ...formContact, [e.target.name]: e.target.value })
  }

  const imageChange = (e: any) => {
    let images: any = formContact.images
    e.target.files.map(async (file: any) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product-image-upload`, {image: file}, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'multipart/form-data'
        }
      })
      images = images.concat(response.data.image.url)
      setFormContact({...formContact, images: images})
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSending('')
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, formContact, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data'
      }
    })
    setSending('MENSAJE ENVIADO')
    setFormContact({name: '', email: '', message: '', images: []})
    setTimeout(() => {
      setSending('Enviar')
    }, 3000)
  }

  return (
      <div className='flex px-4'>
        <div className='m-auto w-[1280px] py-10 block gap-16 xl:flex'>
          <div className='w-full m-auto flex flex-col gap-2 mb-10 xl:w-1/2 xl:mb-auto'>
            <H1>{info.title}</H1>
            <p>{info.description}</p>
          </div>
          <div className='w-full m-auto sm:w-[560px] xl:w-1/2'>
            <div className='rounded-md border flex flex-col gap-4 border-white shadow-2xl p-4 sm:p-10 dark:shadow-none dark:border dark:border-neutral-700 dark:bg-neutral-800'>
              <H2>{info.titleForm}</H2>
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
                  <textarea placeholder='Mensaje' name='message' onChange={inputChange} value={formContact.message} className='p-1.5 text-sm w-full transition-colors duration-100 rounded border h-20 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                </div>
                <input type='file' onChange={imageChange} className='text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-main/10 file:text-main hover:file:bg-main/20 dark:file:bg-neutral-600 dark:file:text-white' />
                <ButtonFunction action={handleSubmit}>
                  {
                    sending === ''
                      ? (
                        <svg aria-hidden="true" className="w-5 h-5 m-auto text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      )
                      : sending
                  }
                </ButtonFunction>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}
