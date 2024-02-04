"use client"
import { ICartProduct, IProduct } from "@/interfaces"
import { NumberFormat, addToCart, addToCartVariation } from "@/utils"
import Link from "next/link"
import Image from 'next/image'
import { useContext, useEffect, useState } from "react"
import CartContext from "@/context/cart/CartContext"
import { useSession } from "next-auth/react"

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
  const { data: session } = useSession()

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

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex flex-col gap-1 m-auto w-40 lg:w-60">
      <Link className="w-fit" href={`/tienda/${product.category.slug}/${product.slug}`}><Image onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="w-40 lg:w-60 rounded-lg" src={image} alt={`Imagen producto ${product.name}`} width={500} height={500} /></Link>
        {
          product.variations?.variations[0].variation !== ''
            ? (
              <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`${hover ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 absolute w-56 hidden flex-col gap-2 text-white bg-black/70 p-2 rounded ml-2 mt-36 lg:flex`}>
                <p className="text-center">{text}</p>
                <div className="flex gap-2">
                  {
                    product.variations?.variations.map(variation => (
                      <button key={variation.variation} onClick={() => addToCartVariation({ variation: variation, setText: setText, setCart: setCart, tempCartProduct: tempCartProduct, user: user })}>
                        <Image className="w-10 rounded" src={variation.image?.url!} alt={`Imagen variación ${variation.variation}`} width={500} height={500} />
                      </button>
                    ))
                  }
                </div>
              </div>
            )
            : <button onClick={() => addToCart({ setCart, setText, tempCartProduct, user })} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`${hover ? 'opacity-1' : 'opacity-0'} transition-opacity duration-300 absolute w-56 text-white bg-black/70 p-2 rounded ml-2 mt-48 hidden lg:block`}>{text}</button>
        }
      <Link href={`/tienda/${product.category.slug}/${product.slug}`}><p className="font-medium text-sm lg:text-[16px]">{product.name}</p></Link>
      <div className="flex gap-2">
        <p className="text-sm lg:text-[16px]">${NumberFormat(product.price)}</p>
        {
          product.beforePrice
            ? <p className="text-xs lg:text-sm line-through">${NumberFormat(product.beforePrice)}</p>
            : ''
        }
      </div>
    </div>
  )
}