import React from 'react'
import { H2, Input } from '../ui'
import { Shipping } from '../products'
import { ISell } from '@/interfaces'

interface Props {
    status: any
    sell: ISell
    setContactView: any
    setContactOpacity: any
    setShippingView: any
    setShippingOpacity: any
    inputChange: any
    setSell: any
    setShipping: any
}

export const Data: React.FC<Props> = ({ status, sell, setContactView, setContactOpacity, setShippingView, setShippingOpacity, inputChange, setSell, setShipping }) => {
  return (
    <>
      {
              status === 'authenticated'
                ? (
                  <>
                    <div className='flex flex-col gap-2 w-full'>
                      <H2>Información de contacto</H2>
                      <div className='bg-neutral-100 p-4 flex gap-2 justify-between dark:bg-neutral-800'>
                        <div className='flex flex-col gap-2'>
                          <p>Nombre: {sell?.firstName ? sell.firstName : 'Se necesita ingresar un nombre'}</p>
                          <p>Apellido: {sell?.lastName ? sell.lastName : 'Se necesita ingresar un apellido'}</p>
                          <p>Email: {sell?.email}</p>
                          <p>Teléfono: {sell?.phone ? sell.phone : 'Se necesita un numero de teléfono'}</p>
                        </div>
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setContactView('flex')
                          setTimeout(() => {
                            setContactOpacity('opacity-1')
                          }, 50)
                        }}>Editar datos</button>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <H2>Dirección de envío</H2>
                      <div className='bg-neutral-100 p-4 flex gap-2 justify-between dark:bg-neutral-800'>
                        <div className='flex flex-col gap-2'>
                          <p>Dirección: {sell?.address ? sell.address : 'Se nececita una dirección'}</p>
                          <p>Detalles: {sell?.details ? sell.details : '-'}</p>
                          <p>Región: {sell?.region ? sell.region : 'Se necesita una región'}</p>
                          <p>Ciudad: {sell?.city ? sell.city : 'Se necesita una ciudad'}</p>
                        </div>
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setShippingView('flex')
                          setTimeout(() => {
                            setShippingOpacity('opacity-1')
                          }, 50)
                        }}>Editar datos</button>
                      </div>
                    </div>
                  </>
                )
                : (
                  <>
                    <div className='flex flex-col gap-4'>
                      <H2>Información de contacto</H2>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Email</p>
                        <Input inputChange={inputChange} value={sell.email} type={'text'} placeholder={'Email'} name='email' text='text-sm' />
                        <div className='flex gap-2'>
                          <input type='checkbox' checked={sell.subscription} onChange={(e: any) => e.target.checked ? setSell({...sell, subscription: true}) : setSell({...sell, subscription: false})} />
                          <span className='text-sm text-neutral-400'>Suscribirse a nuestra lista de emails</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <H2>Dirección de envío</H2>
                      <div className='flex gap-2'>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p className='text-sm'>Nombre</p>
                          <Input inputChange={inputChange} value={sell.firstName} type={'text'} placeholder={'Nombre'} name='firstName' text='text-sm' />
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p className='text-sm'>Apellido</p>
                          <Input inputChange={inputChange} value={sell.lastName} type={'text'} placeholder={'Apellido'} name='lastName' text='text-sm' />
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Dirección</p>
                        <Input inputChange={inputChange} value={sell.address} type={'text'} placeholder={'Dirección'} name='address' text='text-sm' />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Departamento (Opcional)</p>
                        <Input inputChange={inputChange} value={sell.details!} type={'text'} placeholder={'Detalles'} name='details' text='text-sm' />
                      </div>
                      <Shipping setShipping={setShipping} sell={sell} setSell={setSell} />
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Teléfono</p>
                        <div className='flex gap-2'>
                          <span className='mt-auto mb-auto text-sm'>+56</span>
                          <Input inputChange={inputChange} value={sell.phone} type={'text'} placeholder={'Teléfono'} name='phone' text='text-sm' />
                        </div>
                      </div>
                    </div>
                  </>
                )
            }
    </>
  )
}
