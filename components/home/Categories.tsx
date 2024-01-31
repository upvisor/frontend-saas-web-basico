import { ICategory } from "@/interfaces"
import CategoryCard from "../categories/CategoryCard"
import { H2 } from "../ui"

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

export default async function Categories() {

  const categories: ICategory[] = await fetchCategories()

  return (
    <div className="w-full flex px-4">
      <div className="w-full max-w-[1600px] m-auto flex flex-col gap-4">
        <H2 config="text-center">CATEGORIAS</H2>
        <div className="flex flex-col gap-4 justify-between lg:flex-row">
          {
            categories.map(category => (
              <CategoryCard key={category._id} category={category} />
            ))
          }
        </div>
      </div>
    </div>
  )
}