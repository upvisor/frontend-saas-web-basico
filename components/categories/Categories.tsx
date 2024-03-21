"use client"
import { ICategory } from "@/interfaces"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Categories({ categories }: { categories: ICategory[] }) {
  
  const pathname = usePathname()
  
  return (
    <div className="w-full flex px-4 overflow-y-auto">
      <div className="max-w-[1360px] m-auto flex gap-4">
        <Link className={`${pathname === '/tienda' ? 'border-black' : 'hover:border-black'} transition-colors duration-200 py-1 px-4 border`} href='/tienda'>Todos los productos</Link>
        {
          categories.map(category => (
            <Link key={category._id} className={`${pathname === `/tienda/${category.slug}` ? 'border-black' : 'hover:border-black'} py-1 px-4 border transition-colors duration-200`} href={`/tienda/${category.slug}`}>{ category.category }</Link>
          ))
        }
      </div>
    </div>
  )
}