"use client"
import { ICartProduct, IDesign, IProduct } from "@/interfaces"
import { useEffect, useRef, useState } from "react"
import { NoReviews, NoReviewsProduct, PopupAddCart, ProductDetails, ProductOffer, RecomendedProducts, Reviews, ReviewsProduct, ShippingCost, ShippingPrice } from "./"
import { ButtonAddToCart, ButtonNone, H1, H2, H3, ItemCounter, P, ProductSlider, Spinner } from "../ui"
import Link from "next/link"
import Image from 'next/image'
import { NumberFormat } from "@/utils"
import axios from "axios"
import Cookies from 'js-cookie'

declare const fbq: Function

export default function PageProduct ({ product, design, products }: { product: IProduct, design: IDesign, products: IProduct[] }) {

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
  const [descriptionView, setDescriptionView] = useState(0)
  const [descriptionRotate, setDescriptionRotate] = useState('-rotate-90')
  const [returnView, setReturnView] = useState(0)
  const [returnRotate, setReturnRotate] = useState('rotate-90')
  const [detailsOpacity, setDetailsOpacity] = useState('opacity-0')
  const [detailsPosition, setDetailsPosition] = useState('-bottom-44')
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })

  const contentRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLDivElement>(null)

  const viewContent = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/view-content`, { product: product, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    fbq('track', 'ViewContent', {content_name: product.name, content_category: product.category.category, currency: "clp", value: product.price, content_ids: [product._id], contents: { id: product._id, category: product.category.category, item_price: product.price, title: product.name }, event_id: res.data._id})
  }

  useEffect(() => {
    viewContent()
  }, [])
    
  const filterProducts = () => {
    let pruebaSet: Set<IProduct> = new Set();
    
    product.tags.forEach(tag => {
      const filteredProducts = products.filter(prod => prod.tags.includes(tag))
      filteredProducts.forEach(prod => pruebaSet.add(prod))
    });
  
    const uniqueProducts = Array.from(pruebaSet)
    console.log(uniqueProducts)
    console.log(product)
    const prueba = uniqueProducts.filter(prod => prod._id !== product._id)
    setProductsFiltered(prueba)
  }
    
  useEffect(() => {
    filterProducts()
  }, [products])

  const handleScrollClick = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
    
  const handleScroll = () => {
    if (addButtonRef.current) {
      const buttonRect = addButtonRef.current.getBoundingClientRect()
      if (buttonRect.top > 0 && buttonRect.bottom < window.innerHeight) {
        setDetailsOpacity('opacity-0')
        setDetailsPosition('-bottom-44')
      } else {
        setDetailsOpacity('opacity-1')
        setDetailsPosition('-bottom-1')
      }
    }
  }
    
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      setDescriptionView(descriptionRotate === '-rotate-90' ? contentRef.current.scrollHeight : 0)
    }
  }, [descriptionRotate])

  useEffect(() => {
    if (infoRef.current) {
      setReturnView(returnRotate === '-rotate-90' ? infoRef.current.scrollHeight : 0)
    }
  }, [returnRotate])
    
  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  let stars = 0
  let quantity = 0

  return (
    <>
      <PopupAddCart popup={popup} setPopup={setPopup} product={product} productsFiltered={productsFiltered} />
      {
        product?.stock > 0
          ? (
            <div className={`${detailsOpacity} ${detailsPosition} flex transition-all duration-200 decoration-slate-200 fixed w-full z-30 p-4`}>
              <ProductDetails product={product} setTempCartProduct={setTempCartProduct} tempCartProduct={tempCartProduct} popup={popup} setPopup={setPopup} />
            </div>
          )
          : ''
      }
      <div className='flex p-4'>
        <div className='block m-auto w-full max-w-[1600px] gap-4 lg:flex xl2:gap-8'>
          <div className='w-full lg:w-7/12'>
            <div className='mb-2'>
              <span className='text-15'><Link href='/tienda'>Tienda</Link> / <Link href={`/tienda/${ product.category.slug }`}>{ product?.category.category }</Link> / <Link href={`/tienda/${product.category.slug}/${ product?.slug }`}>{ product?.name }</Link></span>
            </div>
            <div className='relative top-0 mb-0 1010:mb-5 1010:sticky 1010:top-32'>
              <ProductSlider images={ product?.images } />
            </div>
          </div>
          <div className='w-full mt-2 lg:w-5/12 lg:mt-11'>
            <H1>{ product?.name.toUpperCase() }</H1>
            {
              product?.reviews?.length
                ? product.reviews.map(review => {
                  stars = stars + review.calification
                  quantity = quantity + 1
                  return null
                })
                : (
                  <div onClick={handleScrollClick} className="w-fit h-fit cursor-pointer">
                    <NoReviews />
                  </div>
                )
            }
            {
              product?.reviews?.length
                ? (
                  <div onClick={handleScrollClick} className="w-fit h-fit cursor-pointer">
                    <Reviews reviews={product.reviews} quantity={quantity} stars={stars} />
                  </div>
                )
                : ''
            }
            <div className='flex gap-2 mb-2'>
              <span className='text-[16px] font-medium dark:text-white'>${ product?.price ? NumberFormat(product.price) : '' }</span>
              {
                product?.beforePrice
                  ? <span className='text-sm line-through dark:text-neutral-400'>${ NumberFormat(product?.beforePrice) }</span>
                  : ''
              }
            </div>
            {
              product?.variations?.variations.length && product.variations?.variations[0].variation !== '' && product.variations?.nameVariation !== ''
                ? (
                    <div className='mb-2'>
                      <div className='flex mb-2 gap-2'>
                        <span className='text-sm font-medium'>{product.variations.nameVariation}:</span>
                        <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.variation}</span>
                      </div>
                      {
                        product?.variations.nameSubVariation
                          ? (
                            <div className='flex gap-2 mb-2'>
                              <span className='text-sm font-medium'>{product.variations.nameSubVariation}:</span>
                              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation}</span>
                            </div>
                          )
                          : ''
                      }
                      <div className='flex gap-2 mt-1'>
                        {product?.variations.variations.map(variation => {
                          if (variation.stock > 0) {
                            return (
                              <div key={variation.variation}>
                                <Image src={variation.image!.url} alt='Imagen variación' width={80} height={80} onClick={() => {
                                  if (variation.subVariation) {
                                    setTempCartProduct({...tempCartProduct, variation: variation, subVariation: variation.subVariation, image: variation.image!.url})
                                  } else {
                                    setTempCartProduct({...tempCartProduct, variation: variation, image: variation.image!.url})
                                  }
                                }} className={`w-20 h-20 transition-colors duration-150 border rounded-lg p-1 cursor-pointer hover:border-main ${!tempCartProduct.variation?.subVariation ? tempCartProduct.variation?.variation === variation.variation ? 'border-main dark:border-white' : 'dark:border-neutral-700 hover:dark:border-white' : tempCartProduct.variation?.variation === variation.variation && tempCartProduct.variation?.subVariation === variation.subVariation ? 'border-main' : 'dark:border-neutral-700 hover:dark:border-main'}`} />
                              </div>
                              )
                          } else {
                            return (
                              <div key={variation.variation}>
                                <Image src={variation.image!.url} alt='Imagen variación' width={80} height={80} className={`w-20 h-20 border rounded-lg p-1 cursor-not-allowed bg-white`} />
                              </div>
                              )
                          }
                        })}
                      </div>
                    </div>
                  )
                : ''
            }
            <span className='mb-2 text-[14px] block dark:text-neutral-400'><span className='font-medium dark:text-white'>Stock:</span> { product?.stock } { product?.stock === 1 ? 'unidad' : 'unidades' }</span>
            {
              product?.quantityOffers?.length && product?.quantityOffers[0].descount
                ? (
                  <div className='mb-2'>
                    <p className='text-sm mb-2'>Descuentos por cantidad</p>
                    <div className='flex gap-2'>
                      {
                        product.quantityOffers.map(offer => (
                          <div key={offer._id} className='p-2 border rounded w-20 flex flex-col dark:border-neutral-700'>
                            <p className='text-sm m-auto'>{offer.quantity}+</p>
                            <p className='text-sm m-auto'>${NumberFormat(Math.round((product.price / 100) * (100 - offer.descount)))}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
                : ''
            }
            {
              product?.stock === 0
                ? (
                  <div>
                    <p className='mb-2 text-sm'>Deja tu correo para avisarte cuando tengamos este producto nuevamente en stock</p>
                    <div className='flex gap-2'>
                      <input type='text' placeholder='Correo' className='p-2 text-sm w-56 rounded border focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      <button className='pt-1.5 pb-1.5 h-fit mt-auto mb-auto pl-7 pr-7 rounded-md bg-button text-white'>Enviar</button>
                    </div>
                  </div>
                )
                : (
                  <div ref={addButtonRef} className='flex gap-2 pb-4 border-b dark:border-neutral-800'>
                    <ItemCounter
                      currentValue={ tempCartProduct.quantity }
                      updatedQuantity={ onUpdateQuantity }
                      maxValue={ product?.stock }
                    />
                    {
                      product?.variations?.variations.length
                        ? product.variations.variations[0].variation !== ''
                          ? tempCartProduct.variation
                            ? (
                              <div className="w-fit h-fit" onClick={() => {
                                setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                                setTimeout(() => {
                                  setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                                }, 10)
                              }}>
                                <ButtonAddToCart tempCartProduct={tempCartProduct} />
                              </div>
                            )
                            : <ButtonNone>AÑADIR AL CARRITO</ButtonNone>
                          : (
                            <div className="w-fit h-fit" onClick={() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                              setTimeout(() => {
                                setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                              }, 10)
                            }}>
                              <ButtonAddToCart tempCartProduct={tempCartProduct} />
                            </div>
                          )
                        : (
                          <div className="w-fit h-fit" onClick={() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10)
                          }}>
                            <ButtonAddToCart tempCartProduct={tempCartProduct} />
                          </div>
                        )
                    }
                  </div>
                )
            }
            {
              product?.productsOffer?.length
              ? product.productsOffer[0].productsSale.length
                ? <div className='mt-4 border-b pb-4 dark:border-neutral-800'>
                  <h5 className='text-[14px] tracking-wide font-medium mb-2 md:text-[16px] dark:text-white'>OFERTAS POR LA COMPRA DE ESTE PRODUCTO</h5>
                  {
                    product.productsOffer.map(offer => <ProductOffer key={offer.productsSale[0].slug} offer={offer} />)
                  }
                </div>
                : ''
              : ''
            }
            <div ref={reviewRef} className='mt-4 border-b pb-4 dark:border-neutral-800'>
              <button onClick={(e: any) => {
                e.preventDefault()
                if (descriptionRotate === '-rotate-90') {
                  setDescriptionRotate('rotate-90')
                } else {
                  setDescriptionRotate('-rotate-90')
                }
              }} className='flex gap-2 w-full justify-between'>
                <h5 className='text-[14px] tracking-wide font-medium md:text-[16px] dark:text-white'>DESCRIPCIÓN</h5>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className={`${descriptionRotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
              </button>
              <div ref={contentRef} style={{ maxHeight: `${descriptionView}px`, overflow: 'hidden', transition: 'max-height 0.2s' }} className={`${descriptionView} transition-all duration-200 flex flex-col gap-2 mt-2`}>
                {product?.description.split('/').map(des => {
                  return <p className='text-[#444444] mb-1 text-sm dark:text-neutral-400 md:text-[16px]' key={des}>{des}</p>
                })}
              </div>
            </div>
            <ShippingPrice />
            {
              design.product?.titleInfo && design.product?.titleInfo !== '' && design.product.textInfo && design.product.textInfo !== ''
                ? (
                  <div className='mt-4 pb-4 border-b dark:border-neutral-800'>
                    <button onClick={(e: any) => {
                      e.preventDefault()
                      if (returnRotate === '-rotate-90') {
                        setReturnRotate('rotate-90')
                      } else {
                        setReturnRotate('-rotate-90')
                      }
                    }} className='flex gap-2 w-full justify-between'>
                      <h5 className='text-[14px] tracking-wide font-medium md:text-[16px] dark:text-white'>{design.product.titleInfo.toUpperCase()}</h5>
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className={`${returnRotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
                    </button>
                    <div ref={infoRef} style={{ maxHeight: `${returnView}px`, overflow: 'hidden', transition: 'max-height 0.2s' }} className='mt-2'>
                      <p className='text-sm mb-2 text-[#444444] dark:text-neutral-400 md:text-[16px]'>{design.product.textInfo}</p>
                    </div>
                  </div>
                )
                : ''
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-20 my-20 md:gap-28 md:my-28 lg:gap-36 lg:my-36 sm:p-4">
        {
          product.informations?.map((information, index) => {
            if (information.align === 'Izquierda') {
              return (
                <div key={index} className="flex flex-col gap-16 w-full m-auto max-w-[1600px] sm:flex-row">
                  <div className="w-full flex sm:w-1/2 sm:hidden">
                    <Image className="m-auto w-full sm:w-auto" src={information.image.url} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                  </div>
                  <div className="flex flex-col gap-2 w-full p-4 sm:p-0 m-auto sm:w-1/2">
                    {
                      information.title !== ''
                        ? <H2>{information.title}</H2>
                        : ''
                    }
                    {
                      information.description !== ''
                        ? <P>{information.description}</P>
                        : ''
                    }
                  </div>
                  <div className="w-full hidden sm:w-1/2 sm:flex">
                    <Image className="m-auto" src={information.image.url} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                  </div>
                </div>
              )
            } else {
              return (
                <div key={index} className="flex flex-col gap-16 w-full m-auto max-w-[1600px] sm:flex-row">
                  <div className="w-full flex sm:w-1/2">
                    <Image className="m-auto w-full sm:w-auto" src={information.image.url} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                  </div>
                  <div className="flex flex-col gap-2 w-full m-auto p-4 sm:p-0 sm:w-1/2">
                    {
                      information.title !== ''
                        ? <H2>{information.title}</H2>
                        : ''
                    }
                    {
                      information.description !== ''
                        ? <P>{information.description}</P>
                        : ''
                    }
                  </div>
                </div>
              )
            }
          })
        }
        
      </div>
      <div className='flex p-4'>
        <div className='w-[1600px] m-auto'>
          <H2>EVALUACIONES DE CLIENTES</H2>
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
      {
        productsFiltered.length >= 1
            ? <RecomendedProducts products={ productsFiltered } title={design.product.title !== '' ? design.product.title : 'PRODUCTOS RECOMENDADOS'} productSelect={product} />
            : ''
      }
    </>
  )
}