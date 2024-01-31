import React from "react"

export const ButtonFunction = ({ children, action }: { children: React.ReactNode, action: any }) => {
  return (
    <button onClick={action} className="px-6 py-1.5 bg-main border font-medium border-main text-white transition-colors duration-200 rounded hover:bg-transparent hover:text-main">{ children }</button>
  )
}