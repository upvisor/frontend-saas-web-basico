import React from 'react'
import { H2 } from '../ui'
import { ISell } from '@/interfaces'

interface Props {
    contactMouse: boolean
    setContactOpacity: any
    setContactView: any
    contactView: string
    contactOpacity: string
    setContactMouse: any
    inputChange: any
    sell: ISell
}

export const EditData: React.FC<Props> = ({ contactMouse, setContactOpacity, setContactView, contactView, contactOpacity, setContactMouse, inputChange, sell }) => {
  return (
    <div onClick={() => {
        if (!contactMouse) {
          setContactOpacity('opacity-0')
          setTimeout(() => {
            setContactView('hidden')
          }, 200)
        }
      }} className={`${contactView} ${contactOpacity} transition-opacity duration-200 w-full h-full fixed z-50 bg-black/20`}>
        <div onMouseEnter={() => setContactMouse(true)} onMouseLeave={() => setContactMouse(false)} className={`m-auto p-6 bg-white flex flex-col gap-4 rounded-md shadow-md max-w-[500px] w-full`}>
          <H2>Editar datos de contacto</H2>
          <div className='flex gap-2'>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Nombre</p>
              <input type='text' placeholder='Nombre' name='firstName' onChange={inputChange} value={sell.firstName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Apellido</p>
              <input type='text' placeholder='Apellido' name='lastName' onChange={inputChange} value={sell.lastName} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Teléfono</p>
            <div className='flex gap-2'>
              <span className='mt-auto mb-auto text-sm'>+56</span>
              <input type='text' placeholder='Teléfono' name='phone' onChange={inputChange} value={sell.phone} className='border text-sm p-1.5 rounded w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
            </div>
          </div>
          <button onClick={(e: any) => {
            e.preventDefault()
            setContactOpacity('opacity-0')
            setTimeout(() => {
              setContactView('hidden')
            }, 200)
          }} className='w-full bg-main text-white h-10 tracking-widest font-medium'>GUARDAR DATOS</button>
        </div>
      </div>
  )
}
