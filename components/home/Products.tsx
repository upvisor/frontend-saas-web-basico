"use client"
import { ICategory, IProduct } from "@/interfaces"
import SliderProducts from "./SliderProducts"
import { H2 } from "../ui"
import { useEffect, useState } from "react"

export default function Products({ products, title, filter, categories, product }: { products: IProduct[], title: string, filter: string, categories: ICategory[], product?: IProduct }) {

  const [productsFilter, setProductsFilter] = useState(products)

  const filterProducts = () => {
    let prod = products
    if (filter === 'Todos') {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      setProductsFilter(prod)
    } else if (filter === 'Productos en oferta') {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      prod = prod.filter(product => product.beforePrice)
      setProductsFilter(prod)
    } else if (filter === 'Productos con que contengan algun tag' && product) {
      const productsTag = products.filter(producto => producto.tags.some(tag => product.tags.includes(tag)))
      const productsFinal = productsTag.filter(prod => prod._id !== product._id)
      setProductsFilter(productsFinal)
    } else {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      prod = prod.filter(product => product.category.category === filter)
      setProductsFilter(prod)
    }
  }

  useEffect(() => {
    filterProducts()
  }, [])

  return (
    <div className="w-full flex px-4 mb-8">
      <div className="w-full max-w-[1360px] m-auto flex flex-col gap-4">
        <H2>{ title }</H2>
        <div>
          <SliderProducts products={productsFilter} />
        </div>
      </div>
    </div>
  )
}