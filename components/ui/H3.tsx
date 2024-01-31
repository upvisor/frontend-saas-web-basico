import React from "react";

export const H3 = ({ children, config }: { children: React.ReactNode, config?: string }) => {
  return (
    <h3 className={`${config} font-medium tracking-wide text-[16px] lg:text-[20px]`}>{ children }</h3>
  )
}