import React from 'react'

export const Input = ({ inputChange, value, type, placeholder, name, text }: { inputChange: any, value: any, type: string, placeholder: string, name?: string, text?: string }) => {
  return (
    <input onChange={inputChange} value={value} type={type} placeholder={placeholder} name={name ? name : ''} className={`${text} p-1.5 w-full rounded-md border transition-colors duration-100 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700`} />
  )
}
