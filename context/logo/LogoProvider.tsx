"use client"
import { PropsWithChildren, useState } from "react"
import LogoContext from "./LogoContext"

const LogoProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const [logoLoad, setLogoLoad] = useState(false)

  return (
    <LogoContext.Provider value={{
      logoLoad,
      setLogoLoad
    }}>
      { children }
    </LogoContext.Provider>
  )
}

export default LogoProvider