"use client"
import { IProduct } from "@/interfaces"
import { NumberFormat } from "@/utils"
import Link from "next/link"
import Image from 'next/image'
import { useEffect, useState } from "react"

export default function ProductCard({ product }: { product: IProduct }) {
  
  const [image, setImage] = useState(product.images[0].url)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (product.images.length >= 2) {
      if (hover) {
        setImage(product.images[1].url)
      } else {
        setImage(product.images[0].url)
      }
    }
    
  }, [hover])
  
  return (
    <div className="flex flex-col gap-2 m-auto">
      <Link href={`/tienda/${product.category.slug}/${product.slug}`}><Image onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="w-60 rounded-lg" src={image} alt={`Imagen producto ${product.name}`} width={500} height={500} /></Link>
      <Link href={`/tienda/${product.category.slug}/${product.slug}`}><p>{product.name}</p></Link>
      <div className="flex gap-2">
        <p>${NumberFormat(product.price)}</p>
        {
          product.beforePrice
            ? <p className="text-sm line-through">${NumberFormat(product.beforePrice)}</p>
            : ''
        }
      </div>
    </div>
  )
}