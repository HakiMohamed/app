import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

interface City {
    id: number
    name: string
}

interface CityContextType {
    selectedCity: City | null
    setSelectedCity: (city: City | null) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState<City | null>(null)

    return <CityContext.Provider value={{ selectedCity, setSelectedCity }}>{children}</CityContext.Provider>
}

export const useCity = () => {
    const context = useContext(CityContext)
    if (context === undefined) {
        throw new Error("useCity must be used within a CityProvider")
    }
    return context
}

