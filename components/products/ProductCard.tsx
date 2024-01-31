"use client"
import { ICartProduct, IProduct } from "@/interfaces"
import { NumberFormat } from "@/utils"
import Link from "next/link"
import Image from 'next/image'
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import CartContext from "@/context/cart/CartContext"
import { useSession } from "next-auth/react"
import Cookies from 'js-cookie'

declare const fbq: Function

export default function ProductCard({ product }: { product: IProduct }) {
  
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    name: product.name,
    image: product.images[0].url,
    price: product.price,
    beforePrice: product.beforePrice,
    slug: product.slug,
    quantity: 1,
    stock: product.stock,
    category: product.category,
    quantityOffers: product.quantityOffers
  })
  const [image, setImage] = useState(product.images[0].url)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState('Añadir al carrito')

  const {setCart} = useContext(CartContext)
  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string }

  useEffect(() => {
    if (product.images.length >= 2) {
      if (hover) {
        setImage(product.images[1].url)
      } else {
        setImage(product.images[0].url)
      }
    }
    
  }, [hover])

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

  const addToCartVariation = async (variation: any) => {
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
          const cartFinal = cart.concat({ ...tempCartProduct, variation: variation })
          localStorage.setItem('cart', JSON.stringify(cartFinal))
          setCart(JSON.parse(localStorage.getItem('cart')!))
        }
      } else {
        const cartFinal = cart.concat(tempCartProduct)
        localStorage.setItem('cart', JSON.stringify(cartFinal))
        setCart(JSON.parse(localStorage.getItem('cart')!))
      }
    } else {
      localStorage.setItem('cart', `[${JSON.stringify({ ...tempCartProduct, variation: variation })}]`)
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
  
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex flex-col w-fit gap-1 m-auto">
      <Link className="w-fit" href={`/tienda/${product.category.slug}/${product.slug}`}><Image onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="w-60 rounded-lg" src={image} alt={`Imagen producto ${product.name}`} width={500} height={500} /></Link>
      {
        product.variations?.variations[0].variation !== ''
          ? (
            <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`${hover ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 absolute w-56 flex flex-col gap-2 text-white bg-black/70 p-2 rounded ml-2 mt-36`}>
              <p className="text-center">{text}</p>
              <div className="flex gap-2">
                {
                  product.variations?.variations.map(variation => (
                    <button onClick={() => addToCartVariation(variation)}>
                      <Image className="w-10 rounded" src={variation.image?.url!} alt={`Imagen variación ${variation.variation}`} width={500} height={500} />
                    </button>
                  ))
                }
              </div>
            </div>
          )
          : <button onClick={addToCart} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`${hover ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 absolute w-56 text-white bg-black/70 p-2 rounded ml-2 mt-48`}>{text}</button>
      }
      <Link href={`/tienda/${product.category.slug}/${product.slug}`}><p className="font-medium text-lg">{product.name}</p></Link>
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