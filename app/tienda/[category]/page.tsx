import Categories from "@/components/categories/Categories"
import Filters from "@/components/categories/Filters"
import Products from "@/components/categories/Products"
import { H1 } from "@/components/ui"
import { ICategory, IProduct } from "@/interfaces"
import Image from 'next/image'

export const revalidate = 60

async function fetchCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category}`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

async function fetchProductsCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-category/${category}`)
  return res.json()
}

export default async function CategoryPage({ params }: { params: { category: string } }) {

  const category: ICategory = await fetchCategory(params.category)

  const categories: ICategory[] = await fetchCategories()

  const productsCategory: IProduct[] = await fetchProductsCategory(category.category)

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full flex">
        <div className={`${category.banner?.url ? 'h-64 xl:h-80 2xl:h-96 text-white' : 'pt-10 pb-2'} w-full max-w-[1600px] m-auto flex flex-col gap-2`}>
          <div className="m-auto flex flex-col gap-2">
            <H1 config="text-center">{category.category.toUpperCase()}</H1>
            <p className="text-center">{category.description}</p>
          </div>
        </div>
        {
          category.banner?.url
            ? <Image className={`absolute -z-10 w-full object-cover h-64 xl:h-80 2xl:h-96`} src={category.banner?.url!} alt='Banner categoria' width={1920} height={1080} />
            : ''
        }
      </div>
      <Categories categories={categories} />
      <Filters />
      <Products products={productsCategory} />
    </div>
  )
}