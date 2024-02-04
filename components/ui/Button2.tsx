import React, { PropsWithChildren } from 'react'

export const Button2: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className='py-2 px-6 bg-main rounded-md text-white text-sm border border-main transition-all duration-200 hover:bg-transparent hover:text-main dark:bg-neutral-700 dark:border-neutral-700 dark:hover:bg-transparent dark:hover:text-neutral-500'>
      { children }
    </button>
  )
}