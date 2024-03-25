"use client"
import React from 'react'
import Image from 'next/image'
import { ICartProduct, IProduct } from '@/interfaces'

export const ProductVariations = ({ product, tempCartProduct, setTempCartProduct }: { product: IProduct, tempCartProduct: ICartProduct, setTempCartProduct: any }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <span className='text-sm font-medium'>{product.variations?.nameVariation}:</span>
        <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.variation}</span>
      </div>
      {
        product.variations?.nameVariations.length
          ? (
            <div className='flex gap-2'>
              {
                product.variations?.nameVariations.map(variation => {
                  const find = product.variations?.variations.find(vari => vari.variation === variation.variation)
                  return (
                    <div key={variation?.variation}>
                      {
                        product.variations?.formatVariation === 'Imagen'
                          ? (
                            <Image src={find!.image!.url} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, variation: variation?.variation}, image: find!.image!.url, stock: find?.stock})
                            }} className={`w-20 h-20 transition-colors duration-150 border rounded-lg p-1 cursor-pointer hover:border-button ${tempCartProduct.variation?.variation && tempCartProduct.variation.variation === variation?.variation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`} />
                          )
                          : product.variations?.formatVariation === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.variation}, image: find!.image!.url, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150 hover:border-main ${tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.variation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>
                                <div className={`m-auto w-full h-full rounded-full`} style={{ backgroundColor: `${variation.colorVariation}` }} />
                              </div>
                            )
                            : product.variations?.formatVariation === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, variation: variation?.variation}, image: find!.image!.url, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 hover:border-main cursor-pointer ${tempCartProduct.variation?.variation && tempCartProduct.variation.variation === variation?.variation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>{variation.variation}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
      {
        product?.variations?.nameSubVariation
          ? (
            <div className='flex gap-2'>
              <span className='text-sm font-medium'>{product.variations.nameSubVariation}:</span>
              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation}</span>
            </div>
          )
          : ''
      }
      {
        product.variations?.nameSubVariations?.length
          ? (
            <div className='flex gap-2'>
              {
                product.variations?.nameSubVariations?.map(variation => {
                  const find = product.variations?.variations.find(vari => vari.subVariation === variation.subVariation)
                  return (
                    <div key={variation?.subVariation}>
                      {
                        product.variations?.formatSubVariation === 'Imagen'
                          ? (
                            <Image src={find!.image!.url} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!.url, stock: find?.stock})
                            }} className={`w-20 h-20 transition-colors duration-150 border rounded-lg p-1 cursor-pointer hover:border-button ${tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`} />
                          )
                          : product.variations?.formatSubVariation === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!.url, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150 hover:border-main ${tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>
                                <div className={`m-auto w-full h-full rounded-full`} style={{ backgroundColor: `${variation.colorSubVariation}` }} />
                              </div>
                            )
                            : product.variations?.formatSubVariation === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!.url, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 hover:border-main cursor-pointer ${tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>{variation.subVariation}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
      {
        product?.variations?.nameSubVariation2
          ? (
            <div className='flex gap-2'>
              <span className='text-sm font-medium'>{product.variations.nameSubVariation2}:</span>
              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation2}</span>
            </div>
          )
          : ''
      }
      {
        product.variations?.nameSubVariations2?.length
          ? (
            <div className='flex gap-2'>
              {
                product.variations?.nameSubVariations2?.map(variation => {
                  const find = product.variations?.variations.find(vari => vari.subVariation2 === variation.subVariation2)
                  return (
                    <div key={variation?.subVariation2}>
                      {
                        product.variations?.formatSubVariation2 === 'Imagen'
                          ? (
                            <Image src={find!.image!.url} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!.url, stock: find?.stock})
                            }} className={`w-20 h-20 transition-colors duration-150 border rounded-lg p-1 cursor-pointer hover:border-button ${tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`} />
                          )
                          : product.variations?.formatSubVariation2 === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!.url, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150 hover:border-main ${tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>
                                <div className={`m-auto w-full h-full rounded-full`} style={{ backgroundColor: `${variation.colorSubVariation2}` }} />
                              </div>
                            )
                            : product.variations?.formatSubVariation2 === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!.url, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 hover:border-main cursor-pointer ${tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? 'border-button' : 'dark:border-neutral-700 hover:dark:border-button'}`}>{variation.subVariation2}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
    </div>
  )
}
