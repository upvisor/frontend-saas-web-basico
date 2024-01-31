"use client"
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../interfaces'
import browser from 'browser-detect'
import { SafariRecomendedProducts, OtherRecomendedProducts } from './'
import { useRouter } from 'next/navigation'

interface Props {
  products: IProduct[]
  title: string
  productSelect?: IProduct
}

export const RecomendedProducts: React.FC<Props> = ({ products, title, productSelect }) => {

  const [browserName, setBrowserName] = useState('')
  const [filterProducts, setFilterProducts] = useState<IProduct[]>(products)

  const router = useRouter()

  useEffect(() => {
    setBrowserName(browser().name!)
    const filter = products.filter(product => product.state === true)
    const filter2 = filter.filter(product => product.name !== productSelect?.name)
    setFilterProducts(filter2)
  }, [router])

  return (
    <div>
      {
        browserName === 'safari'
          ? <SafariRecomendedProducts products={filterProducts} title={title} />
          : <OtherRecomendedProducts products={filterProducts} title={title} />
      }
    </div>
  )
}