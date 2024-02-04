import React, { useEffect, useRef } from 'react'
import { ButtonAddToCart, ButtonNone, ItemCounter } from '../ui'
import { IProduct } from '@/interfaces'

interface Props {
    product: IProduct
    tempCartProduct: any
    setPopup: any
    popup: any
    setDetailsPosition: any
    setTempCartProduct: any
}

export const AddToCart: React.FC<Props> = ({ product, tempCartProduct, setPopup, popup, setDetailsPosition, setTempCartProduct }) => {

    const addButtonRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
      if (addButtonRef.current) {
        const buttonRect = addButtonRef.current.getBoundingClientRect()
        if (buttonRect.top > 0 && buttonRect.bottom < window.innerHeight) {
          setDetailsPosition('-bottom-44')
        } else {
          setDetailsPosition('-bottom-1')
        }
      }
    }
          
    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
          
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [])

    const onUpdateQuantity = ( quantity: number ) => {
        setTempCartProduct( (currentProduct: IProduct) => ({
          ...currentProduct,
          quantity
        }))
      }

  return (
    <>
      {
              product?.stock === 0
                ? (
                  <div>
                    <p className='mb-2 text-sm'>Deja tu correo para avisarte cuando tengamos este producto nuevamente en stock</p>
                    <div className='flex gap-2'>
                      <input type='text' placeholder='Correo' className='p-2 text-sm w-56 rounded border focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      <button className='pt-1.5 pb-1.5 h-fit mt-auto mb-auto pl-7 pr-7 rounded-md bg-button text-white'>Enviar</button>
                    </div>
                  </div>
                )
                : (
                  <div ref={addButtonRef} className='flex gap-2 pb-4 border-b dark:border-neutral-800'>
                    <ItemCounter
                      currentValue={ tempCartProduct.quantity }
                      updatedQuantity={ onUpdateQuantity }
                      maxValue={ product?.stock }
                    />
                    {
                      product?.variations?.variations.length
                        ? product.variations.variations[0].variation !== ''
                          ? tempCartProduct.variation
                            ? (
                              <div className="w-fit h-fit" onClick={() => {
                                setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                                setTimeout(() => {
                                  setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                                }, 10)
                              }}>
                                <ButtonAddToCart tempCartProduct={tempCartProduct} />
                              </div>
                            )
                            : <ButtonNone>Añadir al carrito</ButtonNone>
                          : (
                            <div className="w-fit h-fit" onClick={() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                              setTimeout(() => {
                                setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                              }, 10)
                            }}>
                              <ButtonAddToCart tempCartProduct={tempCartProduct} />
                            </div>
                          )
                        : (
                          <div className="w-fit h-fit" onClick={() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10)
                          }}>
                            <ButtonAddToCart tempCartProduct={tempCartProduct} />
                          </div>
                        )
                    }
                  </div>
            )
          }
    </>
  )
}
