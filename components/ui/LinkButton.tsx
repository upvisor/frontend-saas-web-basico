import Link from 'next/link'
import React from 'react'

export const LinkButton = ({ children, url, config, click, style }: { children: React.ReactNode, url: string, config?: string, click?: any, style?: any }) => {
  return (
    <Link onClick={click} className={`${config} ${style.design === 'Borde' ? 'border-b' : style.design === 'Sombreado' ? 'border-b border-black/5' : ''} ${style.form === 'Redondeado' ? 'rounded-xl' : ''} w-fit flex text-center py-2 px-6 transition-colors duration-300`} style={{ backgroundColor: style.primary, color: style.button }} href={url}><p className='m-auto'>{ children }</p></Link>
  )
}
