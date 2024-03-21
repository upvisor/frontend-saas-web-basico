import { ICategory, IInfo } from "@/interfaces"
import CategoryCard from "../categories/CategoryCard"
import { H2 } from "../ui"

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

export default async function Categories({ info }: { info: IInfo }) {

  const categories: ICategory[] = await fetchCategories()

  return (
    <div className="w-full flex px-4">
      <div className="w-full max-w-[1280px] m-auto flex flex-col gap-4">
        {
          info.title
            ? <H2 config="text-center">{info.title}</H2>
            : ''
        }
        <div className="flex flex-col gap-4 justify-between lg:flex-row">
          {
            info.descriptionView
              ? categories.map(category => (
                <CategoryCard key={category._id} category={category} title={"H3"} />
              ))
              : categories.map(category => (
                <CategoryCard key={category._id} category={category} title={"H2"} />
              ))
          }
        </div>
      </div>
    </div>
  )
}