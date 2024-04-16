"use client"
import React, { useState } from 'react'
import { ICartProduct, IProductsOffer } from '../../interfaces'
import { NumberFormat } from '../../utils'
import { Button2AddToCart, Select } from '../ui'
import Image from 'next/image'

interface Props {
  offer: IProductsOffer
}

export const ProductOffer: React.FC<Props> = ({ offer }) => {

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    name: offer.productsSale[0].name,
    image: offer.productsSale[0].images[0].url,
    price: offer.price,
    beforePrice: offer.productsSale[0].beforePrice ? offer.productsSale[0].beforePrice : offer.productsSale[0].price,
    slug: offer.productsSale[0].slug,
    variation: offer.productsSale[0].variations?.variations.length ? offer.productsSale[0].variations.variations[0] : undefined,
    quantity: 1,
    category: { category: offer.productsSale[0].category.category, slug: offer.productsSale[0].category.slug }
  })

  const productChange = (e: any) => {
    offer.productsSale.map(product => {
      if (product.name === e.target.value) {
        setTempCartProduct({...tempCartProduct,
          name: product.name,
          image: product.images[0].url,
          beforePrice: product.beforePrice,
          slug: product.slug,
          variation: product.variations?.variations.length ? product.variations.variations[0] : undefined
        })
      }
    })
  }

  const variationChange = (e: any) => {
    const product = offer.productsSale.find(product => product.name === e.target.name)
    const variation = product?.variations?.variations.find(variation => variation.variation === e.target.value)
    setTempCartProduct({...tempCartProduct,
      variation: variation
    })
  }

  return (
    <div className='flex'>
      {
        tempCartProduct.variation
          ? <Image className='w-24 h-24 mr-1 mt-auto mb-auto mobile2:w-28 mobile2:h-28 mobile:w-32 mobile:mr-2 mobile:h-32' src={tempCartProduct.variation.image!.url} alt={`Producto ${tempCartProduct.name}`} width={100} height={100} />
          : <Image className='w-24 h-24 mr-1 mt-auto mb-auto mobile2:w-28 mobile2:h-28 mobile:w-32 mobile:mr-2 mobile:h-32' src={tempCartProduct.image!} alt={`Producto ${tempCartProduct.name}`} width={100} height={100} />
      }
      <div className='mt-auto mb-auto flex flex-col gap-1'>
        {
          offer.productsSale.length === 1
            ? <span className='dark:text-white'>{tempCartProduct.name}</span>
            : <Select selectChange={productChange}>
              {
                offer.productsSale.map(product => <option key={product.slug}>{product.name}</option>)
              }
            </Select>
        }
        <div className='flex gap-2'>
          <span className='dark:text-white'>${NumberFormat(Number(tempCartProduct.price))}</span>
          {
            tempCartProduct.beforePrice
              ? <span className='text-sm line-through dark:text-neutral-400'>${NumberFormat(Number(tempCartProduct.beforePrice!))}</span>
              : <span className='text-sm line-through dark:text-neutral-400'>${NumberFormat(Number(tempCartProduct.price!))}</span>
          }
        </div>
        {
          tempCartProduct.variation !== undefined
            ? <Select name={tempCartProduct.name} selectChange={variationChange}>
              {
                offer.productsSale.map(product => {
                  if (tempCartProduct.name === product.name) {
                    return product.variations?.variations?.map(variation => <option key={variation.variation}>{variation.variation}</option>)
                  }
                  return null
                })
              }
            </Select>
            : ''
        }
        <Button2AddToCart tempCartProduct={tempCartProduct} />
      </div>
    </div>
  )
}
