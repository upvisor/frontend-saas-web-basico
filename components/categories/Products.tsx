"use client"
import { IProduct } from "@/interfaces"
import ProductCard from "../products/ProductCard"
import { useEffect, useState } from "react"

export default function Products({ products }: { products: IProduct[] }) {
  
  const [productsOrder, setProductsOrder] = useState<IProduct[]>(products)
  const [order, setOrder] = useState('Más recientes')

  const orderProducts = () => {
    if (order === 'Más recientes') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
      setProductsOrder(before)
    }
    if (order === 'Mayor precio') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.price < b.price) ? 1 : -1)
      setProductsOrder(before)
    }
    if (order === 'Menor precio') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.price > b.price) ? 1 : -1)
      setProductsOrder(before)
    }
  }

  useEffect(() => {
    orderProducts()
  }, [order])
  
  return (
    <>
      <div className="w-full flex px-4">
        <div className="max-w-[1600px] w-full m-auto flex gap-4 justify-between flex-wrap">
          <button>Filtros</button>
          <select value={order} onChange={(e: any) => setOrder(e.target.value)} className="border rounded py-1 w-44">
            <option>Más recientes</option>
            <option>Mayor precio</option>
            <option>Menor precio</option>
          </select>
        </div>
      </div>
      <div className="w-full flex px-4 mb-8">
        <div className="max-w-[1600px] w-full m-auto flex gap-4 justify-between flex-wrap">
          {
            productsOrder.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          }
        </div>
      </div>
    </>
  )
}