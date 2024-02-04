import React from 'react'
import { H2 } from '../ui'
import { Shipping } from '../products'
import { ISell } from '@/interfaces'

interface Props {
    shippingMouse: boolean
    setShippingOpacity: any
    setShippingView: any
    shippingView: string
    shippingOpacity: string
    setShippingMouse: any
    sell: ISell
    inputChange: any
    setSell: any
    setShipping: any
}

export const EditShipping: React.FC<Props> = ({ shippingMouse, setShippingOpacity, setShippingView, shippingView, shippingOpacity, setShippingMouse, sell, inputChange, setSell, setShipping }) => {
  return (
    <div onClick={() => {
        if (!shippingMouse) {
          setShippingOpacity('opacity-0')
          setTimeout(() => {
            setShippingView('hidden')
          }, 200)
        }
      }} className={`${shippingView} ${shippingOpacity} transition-opacity duration-200 w-full h-full fixed z-50 bg-black/20`}>
        <div onMouseEnter={() => setShippingMouse(true)} onMouseLeave={() => setShippingMouse(false)} className={`m-auto p-6 bg-white flex flex-col gap-4 rounded-md shadow-md max-w-[500px] w-full`}>
          <H2>Editar dirección de envío</H2>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Dirección</p>
            <input type='text' placeholder='Dirección' name='address' onChange={inputChange} value={sell.address} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Deptartamento</p>
            <input type='text' placeholder='Departamento (Opcional)' name='details' onChange={inputChange} value={sell.details} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
          </div>
          <Shipping setShipping={setShipping} sell={sell} setSell={setSell} />
          <button onClick={(e: any) => {
            e.preventDefault()
            setShippingOpacity('opacity-0')
            setTimeout(() => {
              setShippingView('hidden')
            }, 200)
          }} className='w-full bg-main text-white h-10 tracking-widest font-medium'>GUARDAR DATOS</button>
        </div>
      </div>
  )
}
