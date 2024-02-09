"use client"
import { Spinner } from '@/components/ui'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function PayProcess () {

  const router = useRouter()

  const verifyPay = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenWs = urlParams.get('token_ws')
    const status = urlParams.get('collection_status')
    if (tokenWs) {
      const sell = JSON.parse(localStorage.getItem('sell')!)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs, sell: sell })
      if (response.data.status === 'FAILED') {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
        router.push('/pago-fallido')
      }
      if (response.data.status === 'AUTHORIZED') {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado' })
        router.push('/gracias-por-comprar')
      }
    } else if (status) {
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (status === 'approved') {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado' })
        router.push('/gracias-por-comprar')
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
        router.push('/pago-fallido')
      }
    }
  }

  useEffect(() => {
    verifyPay()
  }, [])

  return (
    <div className='w-full bg-white fixed flex' style={{ height: 'calc(100% - 150px)' }}>
      <div className='w-fit m-auto'>
        <Spinner />
      </div>
    </div>
  )
}