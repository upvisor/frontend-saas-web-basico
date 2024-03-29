import React from 'react'
import { H2 } from '../ui'
import { NumberFormat, offer } from '@/utils'
import { ISell, IShipping } from '@/interfaces'

interface Props {
    shipping: IShipping[] | undefined
    sell: ISell
    inputChange: any
    setSell: any
}

export const ShippingPay: React.FC<Props> = ({ shipping, sell, inputChange, setSell }) => {

    const shippingChange = (e: any) => {
        setSell({ ...sell, shippingMethod: e.target.className, shipping: e.target.value, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(e.target.value) })
      }

  return (
    <>
      {
              shipping !== undefined
                ? (
                  <div className='flex flex-col gap-4'>
                    <H2>Envío</H2>
                    <div className='flex flex-col gap-2'>
                      {
                        shipping.map(item => (
                          <div className='flex gap-2 justify-between p-2 border rounded-md dark:border-neutral-700' key={item.serviceDescription}>
                            <div className='flex gap-2'>
                              <input type='radio' name='shipping' className={item.serviceDescription} value={item.serviceValue} onChange={shippingChange} />
                              <p className='text-sm mt-auto mb-auto'>{item.serviceDescription}</p>
                            </div>
                            <p className='text-sm'>${NumberFormat(Number(item.serviceValue))}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
                : ''
            }
            {
              sell.shippingMethod
                ? (
                  <div className='flex flex-col gap-4'>
                    <H2>Pago</H2>
                    <div className='flex flex-col gap-2'>
                      <div className='flex gap-2 p-2 border rounded-md dark:border-neutral-700'>
                        <input type='radio' name='pay' value='WebPay Plus' onChange={inputChange} />
                        <p className='text-sm'>WebPay Plus</p>
                      </div>
                      <div className='flex gap-2 p-2 border rounded-md dark:border-neutral-700'>
                        <input type='radio' name='pay' value='MercadoPago' onChange={inputChange} />
                        <p className='text-sm'>MercadoPago</p>
                      </div>
                    </div>
                  </div>
                )
                : ''
            }
    </>
  )
}
