"use client"
import ProductCard from "../products/ProductCard"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from  "./Products.module.css"
import { Pagination } from "swiper/modules"
import { IProduct } from "@/interfaces"

export default function SliderProducts({ products }: { products: IProduct[] }) {
  return (
    <>
      <div className="hidden md:block">
        <Swiper
          className={styles.mySwiper}
          slidesPerView={4}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
        >
          {
            products.map(product => (
              <SwiperSlide className='m-auto' key={product._id}>
                <ProductCard product={product} />
                <div className="h-8" />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      <div className="block md:hidden">
        <Swiper
          className={styles.mySwiper}
          slidesPerView={2}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
        >
          {
            products.map(product => (
              <SwiperSlide className='m-auto' key={product._id}>
                <ProductCard product={product} />
                <div className="h-8" />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </>
  )
}