"use client"
import React, { useContext, useEffect, useState } from 'react'
import { ICartProduct, IProduct, IVariation } from '../../interfaces'
import { NumberFormat } from '../../utils'
import { ReviewsProductCard } from '.'
import Link from 'next/link'
import Image from 'next/image'
import CartContext from '@/context/cart/CartContext'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Cookies from 'js-cookie'

declare const fbq: Function

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
  const [text, setText] = useState('Añadir al carrito')

  const {setCart} = useContext(CartContext)
  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string }

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

  const addToCart = async () => {
    setText('Producto añadido')
    if (localStorage.getItem('cart')) {
      const cart: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
      if (cart.find((product: ICartProduct) => product.name === tempCartProduct.name)) {
        const productSelect = cart.find((product: ICartProduct) => product.name === tempCartProduct.name)
        if (productSelect?.variation?.variation === tempCartProduct.variation?.variation) {
          const productIndex = cart.findIndex((product: ICartProduct) => product.name === tempCartProduct.name)
          cart[productIndex].quantity = tempCartProduct.quantity + cart[productIndex].quantity
          localStorage.setItem('cart', JSON.stringify(cart))
          setCart(JSON.parse(localStorage.getItem('cart')!))
        } else {
          const cartFinal = cart.concat(tempCartProduct)
          localStorage.setItem('cart', JSON.stringify(cartFinal))
          setCart(JSON.parse(localStorage.getItem('cart')!))
        }
      } else {
        const cartFinal = cart.concat(tempCartProduct)
        localStorage.setItem('cart', JSON.stringify(cartFinal))
        setCart(JSON.parse(localStorage.getItem('cart')!))
      }
    } else {
      localStorage.setItem('cart', `[${JSON.stringify(tempCartProduct)}]`)
      setCart(JSON.parse(localStorage.getItem('cart')!))
    }
    let offerPrice
    if (tempCartProduct.quantityOffers && tempCartProduct.quantity > 1) {
      const filter = tempCartProduct.quantityOffers.filter(offer => offer.quantity <= tempCartProduct.quantity)
      if (filter.length > 1) {
        offerPrice = filter.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
      } else {
        offerPrice = filter[0]
      }
    }
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-cart`, { product: tempCartProduct, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    fbq('track', 'AddToCart', {content_name: tempCartProduct.name, content_type: tempCartProduct.category.category, currency: "clp", value: tempCartProduct.price * tempCartProduct.quantity, content_ids: `['${tempCartProduct._id}']`, contents: [{id: tempCartProduct._id, category: tempCartProduct.category.category, quantity: tempCartProduct.quantity, item_price: tempCartProduct.price, title: tempCartProduct.name}], event_id: res.data._id})
    if (status === 'authenticated') {
      const cartLocal = JSON.parse(localStorage.getItem('cart')!)
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: cartLocal })
    }
    setTimeout(() => {
      setText('Añadir al carrito')
    }, 3000)
  }

  const addToCartVariation = async (variation: IVariation) => {
    setText('Producto añadido')
    if (JSON.parse(localStorage.getItem('cart')!).length) {
      const cart: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
      if (cart.find((product: ICartProduct) => product.name === tempCartProduct.name)) {
        const productSelect = cart.find((product: ICartProduct) => product.name === tempCartProduct.name)
        if (productSelect?.variation?.variation === variation.variation) {
          const productIndex = cart.findIndex((product: ICartProduct) => product.name === tempCartProduct.name)
          cart[productIndex].quantity = tempCartProduct.quantity + cart[productIndex].quantity
          localStorage.setItem('cart', JSON.stringify(cart))
          setCart(JSON.parse(localStorage.getItem('cart')!))
        } else {
          const cartFinal = cart.concat({ ...tempCartProduct, variation: variation, image: variation.image?.url! })
          localStorage.setItem('cart', JSON.stringify(cartFinal))
          setCart(JSON.parse(localStorage.getItem('cart')!))
        }
      } else {
        const cartFinal = cart.concat({ ...tempCartProduct, variation: variation, image: variation.image?.url! })
        localStorage.setItem('cart', JSON.stringify(cartFinal))
        setCart(JSON.parse(localStorage.getItem('cart')!))
      }
    } else {
      localStorage.setItem('cart', `[${JSON.stringify({ ...tempCartProduct, variation: variation, image: variation.image?.url })}]`)
      setCart(JSON.parse(localStorage.getItem('cart')!))
    }
    let offerPrice
    if (tempCartProduct.quantityOffers && tempCartProduct.quantity > 1) {
      const filter = tempCartProduct.quantityOffers.filter(offer => offer.quantity <= tempCartProduct.quantity)
      if (filter.length > 1) {
        offerPrice = filter.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
      } else {
        offerPrice = filter[0]
      }
    }
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-cart`, { product: tempCartProduct, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    fbq('track', 'AddToCart', {content_name: tempCartProduct.name, content_type: tempCartProduct.category.category, currency: "clp", value: tempCartProduct.price * tempCartProduct.quantity, content_ids: `['${tempCartProduct._id}']`, contents: [{id: tempCartProduct._id, category: tempCartProduct.category.category, quantity: tempCartProduct.quantity, item_price: tempCartProduct.price, title: tempCartProduct.name}], event_id: res.data._id})
    if (status === 'authenticated') {
      const cartLocal = JSON.parse(localStorage.getItem('cart')!)
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: cartLocal })
    }
    setTimeout(() => {
      setText('Añadir al carrito')
    }, 3000)
  }

  let stars = 0
  let quantity = 0

  return (
    <div className='inline-block m-auto w-32 sm:w-40'>
      <Link href={`/tienda/${ product.category.slug }/${ product.slug }`} className='flex'>
        <Image
          src={ image } alt={ image }
          onMouseEnter={ () => setIsHovered(true) }
          onMouseLeave={ () => setIsHovered(false) }
          className={`m-auto cursor-pointer w-32 h-auto sm:w-40`}
          style={{ borderRadius: '8px' }}
          width={250}
          height={250}
        />
      </Link>
      {
        product.variations?.variations[0].variation !== ''
          ? (
            <div onMouseEnter={ () => setIsHovered(true) } onMouseLeave={ () => setIsHovered(false) } className={`${isHovered ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 p-2 flex flex-col gap-2 absolute rounded w-36 bg-black/70 ml-2 -mt-[92px]`}>
              <p className='text-center text-sm text-white'>{text}</p>
              <div className='flex gap-2'>
                {
                  product.variations?.variations.map(variation => (
                    <button key={variation.variation} onClick={() => addToCartVariation(variation)}><Image className='w-10 rounded' src={variation.image?.url!} alt={`Imagen variacion ${variation.variation} del producto ${product.name}`} width={500} height={500} /></button>
                  ))
                }
              </div>
            </div>
          )
          : <button onClick={addToCart} onMouseEnter={ () => setIsHovered(true) } onMouseLeave={ () => setIsHovered(false) } className={`${isHovered ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 p-2 absolute rounded w-36 text-sm bg-black/70 ml-2 -mt-11 text-white`}>{text}</button>
      }
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