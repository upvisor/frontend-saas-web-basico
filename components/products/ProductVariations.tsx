import React from 'react'
import Image from 'next/image'
import { ICartProduct, IProduct } from '@/interfaces'

export const ProductVariations = ({ product, tempCartProduct, setTempCartProduct }: { product: IProduct, tempCartProduct: ICartProduct, setTempCartProduct: any }) => {
  return (
    <div className='mb-2'>
      <div className='flex mb-2 gap-2'>
        <span className='text-sm font-medium'>{product.variations?.nameVariation}:</span>
        <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.variation}</span>
      </div>
      {
        product?.variations?.nameSubVariation
          ? (
            <div className='flex gap-2 mb-2'>
              <span className='text-sm font-medium'>{product.variations.nameSubVariation}:</span>
              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation}</span>
            </div>
          )
          : ''
      }
      <div className='flex gap-2 mt-1'>
        {
          product?.variations?.variations.map(variation => {
            if (variation.stock > 0) {
              return (
                <div key={variation.variation}>
                  <Image src={variation.image!.url} alt='Imagen variación' width={80} height={80} onClick={() => {
                  if (variation.subVariation) {
                    setTempCartProduct({...tempCartProduct, variation: variation, subVariation: variation.subVariation, image: variation.image!.url})
                  } else {
                    setTempCartProduct({...tempCartProduct, variation: variation, image: variation.image!.url})
                  }
                }} className={`w-20 h-20 transition-colors duration-150 border rounded-lg p-1 cursor-pointer hover:border-main ${!tempCartProduct.variation?.subVariation ? tempCartProduct.variation?.variation === variation.variation ? 'border-main dark:border-white' : 'dark:border-neutral-700 hover:dark:border-white' : tempCartProduct.variation?.variation === variation.variation && tempCartProduct.variation?.subVariation === variation.subVariation ? 'border-main' : 'dark:border-neutral-700 hover:dark:border-main'}`} />
              </div>
            )
            } else {
              return (
                <div key={variation.variation}>
                  <Image src={variation.image!.url} alt='Imagen variación' width={80} height={80} className={`w-20 h-20 border rounded-lg p-1 cursor-not-allowed bg-white`} />
                </div>
              )
            }
          }
        )}
      </div>
    </div>
  )
}
