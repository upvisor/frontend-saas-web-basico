"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./Slider.module.css"
import { Navigation, Pagination } from "swiper/modules"
import { IDesign } from "@/interfaces"
import Link from "next/link"
import Image from 'next/image'
import { Button, H1 } from "../ui"

export default function Slider({ design }: { design: IDesign }) {
  return (
    <div>
      <Swiper
        className={styles.mySwiper}
        slidesPerView={1}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
      >
        {
          design.home?.banner.length && design.home?.banner[0].image.url !== ''
            ? design.home.banner.map(banner => (
              <SwiperSlide key={banner.title}>
                <div className={`flex h-[450px] md:h-[550px] 2xl:h-[700px]`}>
                  <div className="m-auto w-full p-4">
                    <div className='max-w-[1600px] w-full m-auto'>
                      <H1 config="text-white">{banner.title}</H1>
                      <p className={`text-white text-lg mb-4`}>{banner.text}</p>
                      <Link href={`${banner.linkButton}`}><Button>{banner.textButton}</Button></Link>
                    </div>
                  </div>
                  <Image width={1920} height={1080} className={`absolute object-cover h-full w-full -z-10`} src={banner.image.url} alt='banner' />
                </div>
              </SwiperSlide>
            ))
            : (
              <SwiperSlide>
                <div className={`h-[450px] bg-gradient-to-r from-sky-500 to-indigo-500 pt-20 pb-20 flex md:h-[550px] 2xl:h-[700px]`}>
                  <div className='p-4 w-[1600px] m-auto'>
                  <H1 config="text-white">ENCUENTRA NUESTROS ULTIMOS PRODUCTOS</H1>
                    <Link href='/tienda'><Button>COMPRAR AHORA</Button></Link>
                  </div>
                </div>
              </SwiperSlide>
            )
        }
      </Swiper>
    </div>
  )
}