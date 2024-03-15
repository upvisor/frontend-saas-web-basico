"use client"
import { ICategory, IProduct } from "@/interfaces"
import SliderProducts from "./SliderProducts"
import { H2 } from "../ui"
import { useEffect, useState } from "react"

export default function Products({ products, title, filter, categories }: { products: IProduct[], title: string, filter: string, categories: ICategory[] }) {

  const [productsFilter, setProductsFilter] = useState(products)

  const filterProducts = () => {
    if (filter === 'Todos') {
      setProductsFilter(products)
    } else if (filter === 'Productos en oferta') {
      const fil = products.filter(product => product.beforePrice)
      setProductsFilter(fil)
    } else {
      const fil = products.filter(product => product.category.category === filter)
      setProductsFilter(fil)
    }
  }

  useEffect(() => {
    filterProducts()
  }, [])

  return (
    <div className="w-full flex px-4 mb-8">
      <div className="w-full max-w-[1600px] m-auto flex flex-col gap-4">
        <H2>{ title }</H2>
        <div>
          <SliderProducts products={productsFilter} />
        </div>
      </div>
    </div>
  )
}