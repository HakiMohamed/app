import type React from "react"
import { createContext, useState, useContext, useCallback } from "react"

type DockContextType = {
    isDockVisible: boolean
    showDock: () => void
    hideDock: () => void
}

const DockContext = createContext<DockContextType | undefined>(undefined)

export const DockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDockVisible, setIsDockVisible] = useState(true)

    const showDock = useCallback(() => setIsDockVisible(true), [])
    const hideDock = useCallback(() => setIsDockVisible(false), [])

    return <DockContext.Provider value={{ isDockVisible, showDock, hideDock }}>{children}</DockContext.Provider>
}

export const useDock = () => {
    const context = useContext(DockContext)
    if (context === undefined) {
        throw new Error("useDock must be used within a DockProvider")
    }
    return context
}

