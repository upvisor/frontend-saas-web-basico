import React from 'react'
import { ICartProduct, IProduct } from '../../interfaces'
import { NumberFormat } from '../../utils'
import { ButtonAddToCart, ButtonNone, Select } from '../ui'
import Image from 'next/image'

interface Props {
  product: IProduct,
  tempCartProduct: ICartProduct,
  setTempCartProduct: any
  popup: any
  setPopup: any
}

export const ProductDetails: React.FC<Props> = ({ product, tempCartProduct, setTempCartProduct, popup, setPopup }) => {

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( (currentProduct: any) => ({
      ...currentProduct,
      quantity
    }))
  }

  const selectVariation = (e: any) => {
    const tempProduct = { ...tempCartProduct }
    let vari: string = ''
    let subVari: string = ''
    let subVari2: string = ''
    if (e.target.value.includes(' / ')) {
      const variation = e.target.value.split(' / ')
      vari = variation[0]
      subVari = variation[1]
      if (variation[2]) {
        subVari2 = variation[2]
      }
    } else {
      vari = e.target.value
    }
    if (subVari !== '') {
      const variationSelect = product.variations?.variations.filter(variation => variation.variation === vari)
      const variation = variationSelect?.find(variation => variation.subVariation === subVari)
      if (subVari2 !== '') {
        const varia = variationSelect?.find(variation => variation.subVariation2 === subVari2 && variation.subVariation === subVari && variation.variation === vari)
        tempProduct.variation = varia
        tempProduct.image = varia!.image!.url
      } else {
        tempProduct.variation = variation
        tempProduct.image = variation!.image!.url
      }
    } else {
      const variationSelect = product.variations?.variations.find(variation => variation.variation === vari)
      tempProduct.variation = variationSelect
      tempProduct.image = variationSelect!.image!.url
    }
    setTempCartProduct(tempProduct)
  }

  return (
      <div className='m-auto p-4 block bg-white gap-2 w-full border-t justify-around dark:bg-neutral-900 dark:border dark:border-neutral-800 sm:flex'>
        <div className='flex mb-2 justify-around gap-2 sm:mb-0'>
          <Image className='w-20 h-20 mt-auto mb-auto' src={product.images[0].url} alt={product.name} width={80} height={80} />
          <div className='mt-auto mb-auto'>
            <p>{product.name}</p>
            <div className='flex gap-1'>
              <span className='font-medium'>${NumberFormat(product.price)}</span>
              {
                product.beforePrice
                  ? <span className='line-through text-sm'>${NumberFormat(product.beforePrice)}</span>
                  : ''
              }
            </div>
            {
              product.variations?.variations.length
                ? product.variations.variations[0].variation !== ''
                  ? <Select selectChange={selectVariation} value={tempCartProduct.variation?.variation ? tempCartProduct.variation.subVariation ? tempCartProduct.variation.subVariation2 ? `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation} / ${tempCartProduct.variation.subVariation2}` : `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation}` : tempCartProduct.variation?.variation : 'Seleccionar variación'}>
                      <option>Seleccionar variación</option>
                      {
                        product.variations.variations.map(variation => (
                          <option key={variation.variation}>{variation.variation}{variation.subVariation && variation.subVariation !== '' ? ` / ${variation.subVariation}` : ''}{variation.subVariation2 && variation.subVariation2 !== '' ? ` / ${variation.subVariation2}` : ''}</option>
                        ))
                      }
                    </Select>
                  : ''
                : ''
              }
          </div>
        </div>
        {
          product.stock === 0
            ? (
              <div className='flex'>
                <div className='m-auto flex flex-col'>
                  <p className='mb-2 text-sm'>Deja tu correo para avisarte cuando tengamos este producto nuevamente en stock</p>
                  <div className='flex gap-2 m-auto'>
                    <input type='text' placeholder='Correo' className='p-2 text-sm w-64 rounded border focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                    <button className='pt-1.5 pb-1.5 h-fit mt-auto mb-auto pl-7 pr-7 rounded-md bg-button text-white'>Enviar</button>
                  </div>
                </div>
              </div>
            )
            : (
              <div className='flex w-full max-w-[500px]'>
                <div className='flex m-auto justify-around gap-2 w-full h-fit'>
                  {
                    product.variations?.variations.length
                      ? product.variations.variations[0].variation !== ''
                        ? tempCartProduct.variation
                          ? (
                            <div className="w-full h-fit" onClick={() => {
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
                          <div className="w-full h-fit" onClick={() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10)
                          }}>
                            <ButtonAddToCart tempCartProduct={tempCartProduct} />
                          </div>
                        )
                      : (
                        <div className="w-full h-fit" onClick={() => {
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
              </div>
            )
        }
      </div>
  )
}
