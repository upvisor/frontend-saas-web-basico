import Link from 'next/link'
import React from 'react'

export const LinkButton = ({ children, url, config }: { children: React.ReactNode, url: string, config: string }) => {
  return (
    <Link className={`${config} bg-button text-center rounded py-1.5 text-white border border-button px-6 transition-colors duration-200 font-medium tracking-wide hover:bg-transparent hover:text-button`} href={url}>{ children }</Link>
  )
}
