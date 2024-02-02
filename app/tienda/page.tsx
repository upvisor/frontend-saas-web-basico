import Banner from "@/components/categories/Banner"
import Categories from "@/components/categories/Categories"
import Products from "@/components/categories/Products"
import { ICategory, IProduct } from "@/interfaces"

export const revalidate = 60

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}

export default async function ShopPage() {

  const categories: ICategory[] = await fetchCategories()

  const products: IProduct[] = await fetchProducts()

  return (
    <div className="flex flex-col gap-6">
      <Banner />
      <Categories categories={categories} />
      <Products products={products} />
    </div>
  )
}