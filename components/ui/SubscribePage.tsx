"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { IDesign, IInfo } from '@/interfaces'
import { ButtonFunction, H2, Input, Spinner2 } from '.'

export const SubscribePage = ({ info }: { info: IInfo }) => {

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
      <form className='m-auto w-[1360px] mt-16 mb-16 flex flex-col gap-4'>
        <H2 config='text-center'>{info?.title ? info.title : 'Suscribete a nuestra lista'}</H2>
        <div className='flex gap-2'>
          <Input inputChange={inputChange} type='text' placeholder={'Email'} value={subscribeData.email} />
          <ButtonFunction action={handleSubmit}>{loading ? <Spinner2 /> : 'Envíar'}</ButtonFunction>
        </div>
        <div className={successSubscribe}>
          <p className='text-green mt-2'>Suscripción realizada con exito</p>
        </div>
      </form>
    </div>
  )
}
