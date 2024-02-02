import React from "react"

export const ButtonFunction = ({ children, action }: { children: React.ReactNode, action: any }) => {
  return (
    <button onClick={action} className="px-6 py-1.5 bg-main border border-main text-white transition-colors duration-200 rounded-md hover:bg-transparent hover:text-main">{ children }</button>
  )
}