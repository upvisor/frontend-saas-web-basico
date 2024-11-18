import Link from 'next/link'
import React from 'react'

export const LinkButton = ({ children, url, config, click }: { children: React.ReactNode, url: string, config?: string, click?: any }) => {
  return (
    <Link onClick={click} className={`${config} w-fit flex bg-main text-center rounded-xl text-white py-2 px-6 transition-colors duration-300 shadow-md shadow-main/30 hover:bg-main/80`} href={url}><p className='m-auto'>{ children }</p></Link>
  )
}
