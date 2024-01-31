import Categories from "@/components/home/Categories"
import Products from "@/components/home/Products"
import Slider from "@/components/home/Slider"
import { IDesign, IProduct } from "@/interfaces"

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}

export default async function Home() {

  const design: IDesign = await fetchDesign()

  const products: IProduct[] = await fetchProducts()

  return (
    <div className="flex flex-col gap-6">
      <Slider design={ design } />
      <Categories />
      <Products products={ products } />
    </div>
  )
}
