"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from  "./Slider.module.css"
import { Pagination } from "swiper/modules"
import ProductCard from '@/components/products/ProductCard'
import { H2 } from '../ui'
import { IProduct } from '@/interfaces'

export const SliderProducts = ({ products, content }: { products: IProduct[], content: any }) => {
  return (
    <div className='flex w-full p-4'>
                          <div className='m-auto w-full max-w-[1600px] relative items-center'>
                            <H2 config='mb-4'>{ content.info.title }</H2>
                            <Swiper
                              className={styles.mySwiper}
                              slidesPerView={window.innerWidth > 1100 ? 4 : window.innerWidth > 850 ? 3 : 2}
                              pagination={{
                                clickable: true,
                              }}
                              modules={[Pagination]}
                            >
                              {
                                products.map(product => (
                                  <SwiperSlide className='m-auto' key={product._id}>
                                    <ProductCard product={ product } />
                                    <div className='h-8' />
                                  </SwiperSlide>
                                ))
                              }
                            </Swiper>
                          </div>
                        </div>
  )
}
