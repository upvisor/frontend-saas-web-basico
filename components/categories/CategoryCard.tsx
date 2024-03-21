"use client"
import Link from "next/link"
import Image from 'next/image'
import { ICategory } from "@/interfaces"
import { useState } from "react"
import { H2, H3, P } from "../ui"

export default function CategoryCard({ category, title }: { category: ICategory, title: string }) {
  
  const [mouse, setMouse] = useState(false)
  
  return (
    <Link onMouseEnter={() => setMouse(true)} onMouseLeave={() => setMouse(false)} href={`/tienda/${category.slug}`} key={category._id} className="flex max-w-[1360px] flex-row gap-4 w-full lg:flex-col">
      <div className="relative rounded-xl overflow-hidden w-1/2 lg:w-full">
        <Image className={`${mouse ? 'scale-110' : 'scale-100'} transition-transform duration-150 rounded-xl w-full h-auto`} width={500} height={500} src={category.image?.url!} alt={`Imagen de la categoria ${category.category}`} />
      </div>
      <div className="flex flex-col gap-2 m-auto lg:m-0 w-1/2 lg:w-full">
        {
          title === 'H2'
            ? <H2>{category.category}</H2>
            : title === 'H3'
              ? <H3>{category.category}</H3>
              : ''
        }
        <P>{category.description}</P>
      </div>
    </Link>
  )
}