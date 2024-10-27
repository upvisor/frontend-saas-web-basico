import React from 'react'

export const Input = ({ inputChange, value, type, placeholder, name, text }: { inputChange: any, value: any, type?: string, placeholder: string, name?: string, text?: string }) => {
  return (
    <input onChange={inputChange} value={value} type={type ? type : text} placeholder={placeholder} name={name ? name : ''} className={`${text} py-2 px-3 shadow shadow-black/5 w-full rounded-xl text-sm border border-black/5 transition-all duration-200 focus:outline-none focus:border-main focus:ring-1 focus:ring-main hover:border-main/80`} />
  )
}
