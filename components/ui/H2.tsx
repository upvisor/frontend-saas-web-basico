import React from "react";

export const H2 = ({ children, config }: { children: React.ReactNode, config?: string }) => {
  return (
    <h2 className={`${config} text-[20px] font-semibold tracking-widest lg:text-[24px]`}>{ children }</h2>
  )
}