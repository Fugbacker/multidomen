import { createContext, useContext } from 'react'

const SiteContext = createContext(null)

export const SiteProvider = ({ site, children }) => {
  return (
    <SiteContext.Provider value={{ site }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
