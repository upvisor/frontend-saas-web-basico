import { IDesign } from '@/interfaces'
import { createContext } from 'react'

interface ContextProps {
    design: IDesign,
    setDesign: any,
    load: boolean
}

const DesignContext = createContext({} as ContextProps)

export default DesignContext