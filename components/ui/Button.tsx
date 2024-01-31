import React from "react"

export const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="px-6 py-1.5 bg-main border font-medium border-main text-white transition-colors duration-200 rounded hover:bg-transparent hover:text-main">{ children }</button>
  )
}