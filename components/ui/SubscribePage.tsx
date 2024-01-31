"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { IDesign } from '@/interfaces'
import { ButtonFunction, H2, Spinner2 } from '.'

export const SubscribePage = ({ design }: { design: IDesign }) => {

  const [subscribeData, setSubscribeData] = useState({ email: '', tags: ['Suscriptores'] })
  const [successSubscribe, setSuccessSubscribe] = useState('hidden')
  const [loading, setLoading] = useState(false)

  const inputChange = (e: any) => {
    setSubscribeData({...subscribeData, email: e.target.value})
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, subscribeData)
      if (response.data.email) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, { email: response.data.email })
      }
      setSuccessSubscribe('block')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setSuccessSubscribe('block')
      setLoading(false)
    }
  }

  return (
    <div className='w-full bg-neutral-100 pl-4 pr-4 flex dark:bg-neutral-900/40'>
      <form className='m-auto w-[1600px] mt-16 mb-16 flex flex-col gap-4'>
        <H2 config='text-center'>{design.subscription?.title && design.subscription?.title !== '' ? design.subscription?.title.toUpperCase() : 'SUSCRIBETE EN NUESTRA LISTA PARA RECIBIR OFERTAS EXCLUSIVAS'}</H2>
        <div className='flex gap-2'>
          <input type='email' placeholder='Email' value={subscribeData.email} onChange={inputChange} className='p-2 w-full rounded border transition-colors duration-100 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700' />
          <ButtonFunction action={handleSubmit}>{loading ? <Spinner2 /> : 'ENVÍAR'}</ButtonFunction>
        </div>
        <div className={successSubscribe}>
          <p className='text-green mt-2'>Suscripción realizada con exito</p>
        </div>
      </form>
    </div>
  )
}
