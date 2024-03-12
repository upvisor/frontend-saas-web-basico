import { IDesign } from '@/interfaces'
import { createContext } from 'react'

interface ContextProps {
    design: any,
    setDesign: any,
    load: boolean
}

const DesignContext = createContext({} as ContextProps)

export default DesignContext