import React, { useEffect, useRef, useState } from 'react'
import { H1, ProductSlider } from '../ui'
import Link from 'next/link'
import { AddToCart, NoReviews, ProductOffer, ProductVariations, Reviews, ShippingPrice } from '.'
import { NumberFormat } from '@/utils'
import { Design, ICartProduct, IProduct } from '@/interfaces'

interface Props {
    product: IProduct
    tempCartProduct: ICartProduct
    setTempCartProduct: any
    setPopup: any
    popup: any
    design: Design
    stars: number
    quantity: number
    setDetailsPosition: any
}

export const ProductInfo: React.FC<Props> = ({ product, tempCartProduct, setTempCartProduct, setPopup, popup, design, stars, quantity, setDetailsPosition }) => {
  
  const [returnView, setReturnView] = useState(0)
  const [descriptionView, setDescriptionView] = useState(0)
  const [descriptionRotate, setDescriptionRotate] = useState('-rotate-90')
  const [designView, setDesignView] = useState(0)
  const [designRotate, setDesignRotate] = useState('rotate-90')
  const [returnRotate, setReturnRotate] = useState('rotate-90')

  const infoRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const designRef = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLDivElement>(null)

  const handleScrollClick = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (contentRef.current) {
      setDescriptionView(descriptionRotate === '-rotate-90' ? contentRef.current.scrollHeight : 0)
    }
  }, [descriptionRotate])

  useEffect(() => {
    if (designRef.current) {
      setDesignView(designRotate === '-rotate-90' ? designRef.current.scrollHeight : 0)
    }
  }, [designRotate])

  useEffect(() => {
    if (infoRef.current) {
      setReturnView(returnRotate === '-rotate-90' ? infoRef.current.scrollHeight : 0)
    }
  }, [returnRotate])
  
  return (
    <div className='flex p-4'>
      <div className='block m-auto w-full max-w-[1360px] gap-12 lg:flex xl2:gap-8'>
        <div className='w-full lg:w-1/2'>
          <div className='mb-2'>
            <span className='text-15'><Link href='/tienda'>Tienda</Link> / <Link href={`/tienda/${ product.category.slug }`}>{ product?.category.category }</Link> / <Link href={`/tienda/${product.category.slug}/${ product?.slug }`}>{ product?.name }</Link></span>
          </div>
          <div className='relative top-0 mb-0 lg:mb-5 lg:sticky lg:top-32'>
            <ProductSlider images={ tempCartProduct.image && tempCartProduct.image !== '' ? [{ public_id: '', url: tempCartProduct.image }]: product?.images } />
          </div>
        </div>
        <div className='w-full flex flex-col gap-4 mt-2 lg:w-1/2 lg:mt-11'>
          <div className='flex flex-col gap-2'>
            <H1>{ product?.name }</H1>
            {
              design.productPage[0].reviews
                ? (
                  <>
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
                  </>
                )
                : ''
            }
            <div className='flex gap-2'>
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
                  <ProductVariations product={product} tempCartProduct={tempCartProduct} setTempCartProduct={setTempCartProduct} />
                )
                : ''
            }
            <span className='text-[14px] block dark:text-neutral-400'><span className='font-medium dark:text-white'>Stock:</span> { tempCartProduct.stock ? tempCartProduct.stock : product?.stock } { tempCartProduct.stock ? tempCartProduct.stock === 1 ? 'unidad' : 'unidades' : product?.stock === 1 ? 'unidad' : 'unidades' }</span>
          </div>
            {
              product?.quantityOffers?.length && product?.quantityOffers[0].descount
                ? (
                  <div className='flex flex-col gap-2'>
                    {
                        product.quantityOffers.map(offer => (
                          <div onClick={() => setTempCartProduct({ ...tempCartProduct, quantity: tempCartProduct.stock ? tempCartProduct.stock >= offer.quantity ? offer.quantity : tempCartProduct.quantity : product.stock >= offer.quantity ? offer.quantity : tempCartProduct.quantity })} key={offer._id} className={`${tempCartProduct.quantity === offer.quantity ? 'border-button' : ''} flex gap-4 justify-between p-3 border transition-colors duration-150 bg-gray-50 cursor-pointer hover:border-button`}>
                            <div className='flex flex-col gap-2'>
                              <p>{offer.quantity} unidades</p>
                              <p className='py-1 px-3 text-sm rounded-full bg-button text-white'>Ahorra {offer.descount}%</p>
                            </div>
                            <p className='my-auto'>${NumberFormat(Math.round(((product.price * offer.quantity) / 100) * (100 - offer.descount)))}</p>
                          </div>
                        )
                      )
                    }
                  </div>
                )
                : ''
            }
            <AddToCart product={product} tempCartProduct={tempCartProduct} setPopup={setPopup} popup={popup} setDetailsPosition={setDetailsPosition} setTempCartProduct={setTempCartProduct} />
          {
            product?.productsOffer?.length
              ? product.productsOffer[0].productsSale.length
                ? <div className='border-b pb-4 dark:border-neutral-800'>
                  <h5 className='text-[16px] font-medium mb-2 md:text-[18px] dark:text-white'>Ofertas por la compra de este producto</h5>
                  {
                    product.productsOffer.map(offer => <ProductOffer key={offer.productsSale[0].slug} offer={offer} />)
                  }
                </div>
              : ''
            : ''
          }
          <div ref={reviewRef} className='border-b pb-2 dark:border-neutral-800'>
            <button onClick={(e: any) => {
              e.preventDefault()
              if (descriptionRotate === '-rotate-90') {
                setDescriptionRotate('rotate-90')
              } else {
                setDescriptionRotate('-rotate-90')
              }
            }} className='flex gap-2 w-full justify-between'>
              <h5 className='text-[16px] font-medium md:text-[18px] dark:text-white'>Descripción</h5>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className={`${descriptionRotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
            </button>
            <div ref={contentRef} style={{ maxHeight: `${descriptionView}px`, overflow: 'hidden', transition: 'max-height 0.3s' }} className={`${descriptionView} transition-all duration-200 flex flex-col gap-2 mt-2`}>
              {product?.description.split('/').map(des => {
                return <p className='text-[#444444] mb-1 text-sm dark:text-neutral-400 md:text-[16px]' key={des}>{des}</p>
              })}
            </div>
          </div>
          <ShippingPrice />
          {
            design.productPage[0].title !== '' && design.productPage[0].text !== ''
              ? (
                <div className='border-b pb-2 dark:border-neutral-800'>
                  <button onClick={(e: any) => {
                    e.preventDefault()
                    if (designRotate === '-rotate-90') {
                      setDesignRotate('rotate-90')
                    } else {
                      setDesignRotate('-rotate-90')
                    }
                  }} className='flex gap-2 w-full justify-between'>
                    <h5 className='text-[16px] font-medium md:text-[18px] dark:text-white'>{design.productPage[0].title}</h5>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className={`${designRotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
                  </button>
                  <div ref={designRef} style={{ maxHeight: `${designView}px`, overflow: 'hidden', transition: 'max-height 0.3s' }} className={`${designView} transition-all duration-200 flex flex-col gap-2 mt-2`}>
                    <p className='text-[#444444] mb-1 text-sm dark:text-neutral-400 md:text-[16px]'>{design.productPage[0].text}</p>
                  </div>
                </div>
              )
              : ''
          }
        </div>
      </div>
    </div>
  )
}
