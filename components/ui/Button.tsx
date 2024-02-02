import React from "react"

export const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="px-8 py-1.5 bg-main border border-main text-white transition-colors duration-200 rounded-md hover:bg-transparent hover:text-main">{ children }</button>
  )
}