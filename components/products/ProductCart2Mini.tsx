"use client"
import React, { useEffect, useState } from 'react'
import { ICartProduct, IProduct } from '../../interfaces'
import { NumberFormat } from '../../utils'
import { ReviewsProductCard } from '.'
import Link from 'next/link'
import Image from 'next/image'

export const ProductCard2Mini = ({ product }: { product: IProduct }) => {

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    name: product.name,
    image: product.images[0].url,
    price: product.price,
    beforePrice: product.beforePrice,
    slug: product.slug,
    quantity: 1,
    stock: product.stock,
    category: product.category
  })
  const [isHovered, setIsHovered] = useState(false)
  const [image, setImage] = useState(product.images[0].url)

  const changeImage = () => {
    if (product.images[1]) {
      if (isHovered) {
        setImage(product.images[1].url)
      } else {
        setImage(product.images[0].url)
      }
    } else {
      setImage(product.images[0].url)
    }
  }

  useEffect(() => {
    changeImage()
  }, [isHovered, product.images])

  let stars = 0
  let quantity = 0

  return (
    <div className='inline-block m-auto w-32 450:w-40 580:w-52'>
      <Link href={`/tienda/${ product.category.slug }/${ product.slug }`} className='flex'>
        <Image
          src={ image } alt={ image }
          onMouseEnter={ () => setIsHovered(true) }
          onMouseLeave={ () => setIsHovered(false) }
          className={`m-auto cursor-pointer w-32 h-auto 450:w-44 580:w-40`}
          style={{ borderRadius: '8px' }}
          width={250}
          height={250}
        />
      </Link>
      <div>
        {
          product.reviews?.length
            ? product.reviews.map(review => {
              stars = stars + review.calification
              quantity = quantity + 1
              return null
            })
            : ''
        }
        {
          product.reviews?.length
            ? <ReviewsProductCard product={product} quantity={quantity} stars={stars} />
            : <div className='w-1 h-2' />
        }
        <Link href={`/tienda/${product.category.slug}/${product.slug}`} className='cursor-pointer dark:text-white'>{ product.name }</Link>
        <div className='flex gap-2 mt-1 mb-1'>
          <span className='font-medium dark:text-white'>${ NumberFormat(product.price) }</span>
          {
            product.beforePrice
              ? <span className='text-sm line-through dark:text-white'>${ NumberFormat(product.beforePrice) }</span>
              : ''
          }
        </div>
      </div>
    </div>
  )
}