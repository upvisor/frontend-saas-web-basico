import { createContext } from 'react'

interface ContextProps {
    logoLoad: boolean
    setLogoLoad: any
}

const LogoContext = createContext({} as ContextProps)

export default LogoContext