"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { NumberFormat } from '@/utils'
import Link from 'next/link'
import { IProduct } from '@/interfaces'
import { useRouter } from 'next/navigation'
import browser from 'browser-detect'
import { SafariRecomendedProducts } from '.'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from  "./css/OtherProductList.module.css"
import { Pagination } from "swiper/modules"
import { ProductCard2Mini } from './'

interface Props {
    popup: { view: string, opacity: string, mouse: boolean }
    setPopup: any
    product: IProduct
    productsFiltered: IProduct[]
}

export const PopupAddCart: React.FC<Props> = ({ popup, setPopup, product, productsFiltered }) => {

  const [browserName, setBrowserName] = useState('')

  const router = useRouter()

  useEffect(() => {
    setBrowserName(browser().name!)
  }, [router])

  return (
    <div onClick={() => {
      if (!popup.mouse) {
        setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
        setTimeout(() => {
          setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
        }, 200)
      }
    }} className={`fixed ${popup.view} ${popup.opacity} transition-opacity duration-200 top-0 p-4 z-50 bg-black/30 flex w-full h-full`}>
        <div onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className="p-6 w-full overflow-y-auto max-h-full max-w-[700px] shadow-md bg-white flex flex-col gap-4 rounded-xl m-auto md:p-8">
          <h3 className="text-[16px] tracking-widest font-semibold lg:text-[20px]">PRODUCTO AÑADIDO AL CARRITO</h3>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="w-full flex gap-2 sm:w-1/2">
              <Image className="w-32" src={product.images[0].url} alt={`Imagen product ${product.name}`} width={500} height={500} />
              <div className="flex flex-col gap-0 my-auto">
                <p>{product.name}</p>
                <div className="flex gap-2">
                  <p>${NumberFormat(product.price)}</p>
                  {
                    product.beforePrice
                      ? <p className='text-sm line-through'>${NumberFormat(product.beforePrice)}</p>
                      : ''
                  }
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3 my-auto sm:w-1/2">
              <Link className="bg-button text-center rounded py-1.5 text-white border border-button transition-colors duration-200 hover:bg-transparent hover:text-button" href={"/finalizar-compra"}>Ir a pagar</Link>
              <button onClick={(e: any) => {
                e.preventDefault()
                setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                setTimeout(() => {
                  setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
                }, 200)
              }}>Seguir comprando</button>
            </div>
          </div>
          {
            productsFiltered.length > 1
              ? (
                <div className="flex flex-col gap-4">
                  <div>
                    {
                      browserName === 'safari'
                        ? <SafariRecomendedProducts products={productsFiltered} title={'TAMBIEN PODRIA INTERESARTE'} />
                        : (
                          <div className='flex w-full'>
                            <div className='m-auto w-full relative items-center'>
                              <h3 className='text-[16px] tracking-widest font-semibold mb-2 lg:text-[20px] dark:text-white'>{ 'TAMBIEN PODRIAN INTERESARTE' }</h3>
                              <div className='hidden sm:block'>
                                <Swiper
                                  className={styles.mySwiper}
                                  slidesPerView={3}
                                  pagination={{
                                    clickable: true,
                                  }}
                                  modules={[Pagination]}
                                >
                                  {
                                    productsFiltered.map(product => (
                                      <SwiperSlide className='m-auto flex' key={product._id}>
                                        <ProductCard2Mini product={ product } />
                                        <div className='h-8' />
                                      </SwiperSlide>
                                    ))
                                  }
                                </Swiper>
                              </div>
                              <div className='block sm:hidden'>
                                <Swiper
                                  className={styles.mySwiper}
                                  slidesPerView={2}
                                  pagination={{
                                    clickable: true,
                                  }}
                                  modules={[Pagination]}
                                >
                                  {
                                    productsFiltered.map(product => (
                                      <SwiperSlide className='m-auto flex' key={product._id}>
                                        <ProductCard2Mini product={ product } />
                                        <div className='h-8' />
                                      </SwiperSlide>
                                    ))
                                  }
                                </Swiper>
                              </div>
                            </div>
                          </div>
                        )
                    }
                  </div>
                </div>
              )
              : ''
          }
        </div>
      </div>
  )
}
