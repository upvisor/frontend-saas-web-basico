import React, { useEffect, useRef, useState } from 'react'
import { Button2, H2, Input } from '../ui'
import Image from 'next/image'
import { NumberFormat, offer } from '@/utils'
import { ICartProduct, ISell } from '@/interfaces'

export const ResumePhone = ({ cart, sell }: { cart: ICartProduct[] | undefined, sell: ISell }) => {

  const [details, setDetails] = useState(0)
  const [rotate, setRotate] = useState('rotate-90')

  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (detailsRef.current) {
      setDetails(rotate === '-rotate-90' ? detailsRef.current.scrollHeight : 0)
    }
  }, [rotate])

  return (
    <div className='fixed top-[51px] bg-gray-50 w-full border-b p-4 block xl:hidden dark:bg-neutral-800 dark:border-neutral-700'>
        <button className='text-[14px] mb-4 flex gap-2' onClick={() => {
          if (rotate === 'rotate-90') {
            setRotate('-rotate-90')
          } else {
            setRotate('rotate-90')
          }
        }}>{<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className={`${rotate} transition-all duration-150 m-auto w-4 text-lg text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>} resumen del pedido</button>
        <div ref={detailsRef} className={`mb-2`} style={{ maxHeight: `${details}px`, overflow: 'hidden', transition: 'max-height 0.5s' }}>
          <div className='border-b mb-2 flex flex-col gap-2 pb-1 dark:border-neutral-700'>
            <H2>Carrito</H2>
            {
              cart?.length !== 0
                ? cart?.map(product => (
                  <div className='flex gap-2 justify-between mb-2' key={product._id}>
                    <div className='flex gap-2'>
                      <Image className='w-20 h-20 m-auto border rounded-md p-1 dark:border-neutral-700' src={product.image} alt={product.name} width={80} height={80} />
                      <div className='mt-auto mb-auto'>
                        <span className='font-medium'>{product.name}</span>
                        <span className='block'>Cantidad: {product.quantity}</span>
                        {
                          product.variation
                            ? <span className='block'>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}</span>
                            : ''
                        }
                      </div>
                    </div>
                    <div className='flex gap-2 mt-auto mb-auto'>
                      <span className='font-medium'>${NumberFormat(product.quantityOffers?.length ? offer(product) : product.price * product.quantity)}</span>
                      {
                        product.beforePrice
                          ? <span className='text-sm line-through'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                          : ''
                      }
                    </div>
                  </div>
                ))
                : ''
            }
          </div>
          <div className='pb-3 border-b flex flex-col gap-2 dark:border-neutral-700'>
            <H2>Cupon de descuento</H2>
            <div className='flex gap-2'>
              <Input inputChange={undefined} value={undefined} type={'text'} placeholder={'Cupon'} text='text-sm' />
              <Button2>Agregar</Button2>
            </div>
          </div>
          <div className='mt-2 mb-2 pb-2 border-b dark:border-neutral-700'>
            <div className='flex gap-2 justify-between mb-1'>
              <span className='text-[14px]'>Subtotal</span>
              <span className='text-[14px]'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
            </div>
            <div className='flex gap-2 justify-between'>
              <span className='text-[14px]'>Envío</span>
              <span className='text-[14px]'>${NumberFormat(Number(sell.shipping))}</span>
            </div>
          </div>
        </div>
        <div className='flex gap-2 justify-between'>
          <span className='font-medium'>Total</span>
          <span className='font-medium'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping))}</span>
        </div>
      </div>
  )
}
