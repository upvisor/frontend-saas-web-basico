"use client"
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../interfaces'
import browser from 'browser-detect'
import { SafariProductList, OtherProductList } from './'

interface Props {
  products: IProduct[]
  title: string
}

export const ProductList: React.FC<Props> = ({ products, title }) => {

  const [browserName, setBrowserName] = useState('')
  const [filterProducts, setFilterProducts] = useState<IProduct[]>(products)

  useEffect(() => {
    setBrowserName(browser().name!)
    const filter = products.filter(product => product.state === true)
    setFilterProducts(filter)
  }, [products])

  return (
    <div>
      {
        browserName === 'safari'
          ? <SafariProductList products={filterProducts} title={title} />
          : <OtherProductList products={filterProducts} title={title} />
      }
    </div>
  )
}