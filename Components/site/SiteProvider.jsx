import { createContext, useContext } from 'react'

const SiteContext = createContext(null)

export const SiteProvider = ({ site, children }) => {
  console.log('SITE', site)
  return (
    <SiteContext.Provider value={{ site }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
