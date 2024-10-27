import React from 'react'

interface Props {
    placeholder: string
    name?: string
    change: any
    value: string
    config?: string
}

export const Textarea: React.FC<Props> = ({ placeholder, name, change, value, config }) => {
  return (
    <textarea placeholder={placeholder} name={name} onChange={change} value={value} className={`${config} py-2 px-3 w-full text-sm rounded-xl border border-black/5 shadow shadow-black/5 transition-colors duration-200 focus:outline-none focus:border-main focus:ring-1 focus:ring-main hover:border-main/80`} />
  )
}
