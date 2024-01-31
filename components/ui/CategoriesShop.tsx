"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { ICategory } from '../../interfaces'

interface Props {
  categories: ICategory[]
}

export const CategoriesShop: React.FC<Props> = ({ categories }) => {

  const [mouse, setMouse] = useState(-1)
  const [mouseShop, setMouseShop] = useState(false)

  const pathname = usePathname()

  return (
    <div className='flex w-full p-4 overflow-x-auto'>
      <div className='m-auto w-[1600px] flex gap-2'>
        {
          `/tienda` === pathname
            ? (
              <Link href={'/tienda'} className='border border-main text-main transition-colors flex duration-150 h-24 w-40 rounded-lg dark:border-neutral-400 dark:text-white'>
                <p className='text-sm m-auto border-b border-main dark:border-white'>Todos</p>
              </Link>
            )
            : (
              <Link href={'/tienda'} onMouseEnter={() => setMouseShop(true)} onMouseLeave={() => setMouseShop(false)} className='border transition-colors flex duration-150 h-24 w-40 rounded-lg dark:border-neutral-700 hover:border-main hover:text-main hover:dark:border-neutral-400 dark:hover:text-white'>
                <p className={`text-sm ${mouseShop ? 'border-white' : 'border-transparent'} transition-colors duration-150 m-auto border-b`}>Todos</p>
              </Link>
            )
        }
        {
          categories?.length
            ? categories.map((category, index) => {
              if (`/tienda/${category.slug}` === pathname) {
                return (
                  <Link href={`/tienda/${category.slug}`} className='border border-main bg-cover bg-center flex h-24 w-56 rounded-lg dark:border-neutral-400 dark:text-neutral-600' key={category._id} style={{ backgroundImage: `url(${category.image?.url})` }}>
                    <p className='text-sm m-auto text-white border-b'>{category.category}</p>
                  </Link>
                )
              } else {
                return (
                    <Link href={`/tienda/${category.slug}`} onMouseEnter={() => setMouse(index)} onMouseLeave={() => setMouse(-1)} className='border transition-colors duration-150 rounded-lg h-24 w-56 bg-cover bg-center overflow-hidden flex dark:border-neutral-700 hover:border-main hover:text-main hover:dark:border-neutral-400' style={{ backgroundImage: `url(${category.image?.url})` }} key={category._id}>
                      <p className={`text-sm ${mouse === index ? 'border-white' : 'border-transparent'} transition-colors duration-150 m-auto w-fit h-fit text-center text-white border-b`}>{category.category}</p>
                    </Link>
                  )
                }
            })
            : ''
        }
      </div>
    </div>
  )
}
