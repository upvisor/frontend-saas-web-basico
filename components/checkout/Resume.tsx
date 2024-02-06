import React from 'react'
import { Button2, H2, Input } from '../ui'
import Image from 'next/image'
import { NumberFormat, offer } from '@/utils'
import { ICartProduct, ISell } from '@/interfaces'

export const Resume = ({ cart, sell }: { cart: ICartProduct[] | undefined, sell: ISell }) => {
  return (
    <div className='w-5/12 h-fit border rounded-lg border-[#f5f5f7] p-6 hidden sticky top-28 bg-[#f5f5f7] dark:border-neutral-700 dark:bg-neutral-800 xl:block'>
            <div className='mb-2 flex flex-col gap-2 pb-2 border-b dark:border-neutral-700'>
              <H2>Carrito</H2>
              {
                cart?.length !== 0
                  ? cart?.map(product => (
                    <div className='flex gap-2 justify-between mb-2' key={product._id}>
                      <div className='flex gap-2'>
                        <Image className='w-20 h-auto border rounded-md p-1 dark:border-neutral-700' src={product.image} alt={product.name} width={80} height={80} />
                        <div className='mt-auto mb-auto'>
                          <span className='block font-medium'>{product.name.toLocaleUpperCase()}</span>
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
            <div className='mb-2 flex flex-col gap-2 pb-3 border-b dark:border-neutral-700'>
              <H2>Cupon de descuento</H2>
              <div className='flex gap-2'>
                <Input inputChange={undefined} value={undefined} type={'text'} placeholder={'Cupon'} text='text-sm' />
                <Button2>Agregar</Button2>
              </div>
            </div>
            <div className='mb-2 pb-2 border-b dark:border-neutral-700'>
              <div className='flex gap-2 justify-between mb-1'>
                <span className='text-[14px]'>Subtotal</span>
                <span className='text-[14px]'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='text-[14px]'>Envío</span>
                <span className='text-[14px]'>${NumberFormat(Number(sell.shipping))}</span>
              </div>
            </div>
            <div className='flex gap-2 justify-between'>
              <span className='font-medium'>Total</span>
              <span className='font-medium'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping))}</span>
            </div>
          </div>
  )
}
