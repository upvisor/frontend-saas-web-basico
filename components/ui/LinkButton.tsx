import Link from 'next/link'
import React from 'react'

export const LinkButton = ({ children, url, config, click }: { children: React.ReactNode, url: string, config?: string, click?: any }) => {
  return (
    <Link onClick={click} className={`${config} bg-main text-center rounded-xl py-1.5 text-white px-6 transition-colors duration-300 shadow-md shadow-main/30 hover:bg-main/80`} href={url}>{ children }</Link>
  )
}
