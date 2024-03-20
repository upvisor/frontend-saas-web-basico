"use client"
import { Design, ICartProduct, ICategory, IProduct } from "@/interfaces"
import { useEffect, useState } from "react"
import { Information, NoReviewsProduct, PopupAddCart, ProductDetails, ProductInfo, RecomendedProducts, ReviewsProduct } from "./"
import { H1, H2 } from "../ui"
import axios from "axios"
import Cookies from 'js-cookie'

declare const fbq: Function

export default function PageProduct ({ product, design, products, categories }: { product: IProduct, design: Design, products: IProduct[], categories: ICategory[] }) {

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
  const [detailsPosition, setDetailsPosition] = useState('-bottom-44')
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })

  const viewContent = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/view-content`, { product: product, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    fbq('track', 'ViewContent', {content_name: product.name, content_category: product.category.category, currency: "clp", value: product.price, content_ids: [product._id], contents: { id: product._id, category: product.category.category, item_price: product.price, title: product.name }, event_id: res.data._id})
  }

  useEffect(() => {
    viewContent()
  }, [])
    
  const filterProducts = () => {
    let pruebaSet: Set<IProduct> = new Set()
    product.tags.forEach(tag => {
      const filteredProducts = products.filter(prod => prod.tags.includes(tag))
      filteredProducts.forEach(prod => pruebaSet.add(prod))
    })
    const uniqueProducts = Array.from(pruebaSet)
    const prueba = uniqueProducts.filter(prod => prod._id !== product._id)
    setProductsFiltered(prueba)
  }
    
  useEffect(() => {
    filterProducts()
  }, [products])

  let stars = 0
  let quantity = 0

  return (
    <>
      <PopupAddCart popup={popup} setPopup={setPopup} product={product} productsFiltered={productsFiltered} />
      {
        product?.stock > 0
          ? (
            <div className={`${detailsPosition} flex transition-all duration-500 decoration-slate-200 fixed w-full z-30`}>
              <ProductDetails product={product} setTempCartProduct={setTempCartProduct} tempCartProduct={tempCartProduct} popup={popup} setPopup={setPopup} />
            </div>
          )
          : ''
      }
      <ProductInfo product={product} tempCartProduct={tempCartProduct} setTempCartProduct={setTempCartProduct} setPopup={setPopup} popup={popup} design={design} stars={stars} quantity={quantity} setDetailsPosition={setDetailsPosition} />
      {
        (product.informations?.length && (product.informations[0].title !== '' || product.informations[0].description !== '' || product.informations[0].image.url !== ''))
          ? (
            <Information product={product} />
          )
          : ''
      }
      {
        design.productPage[0].reviews
          ? (
            <div className='flex p-4'>
              <div className='w-[1600px] m-auto'>
                <H2>Evaluaciones de clientes</H2>
                <span className='text-[14px] md:text-[16px] dark:text-neutral-400'>Valoracion media</span>
                <div className='mt-2'>
                  {
                    product?.reviews?.length
                      ? <ReviewsProduct quantity={quantity} stars={stars} reviews={product.reviews} />
                      : <NoReviewsProduct />
                  }
                </div>
              </div>
            </div>
          )
          : ''
      }
    </>
  )
}