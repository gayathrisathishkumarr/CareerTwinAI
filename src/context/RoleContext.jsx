import React, { createContext, useContext, useEffect, useState } from 'react'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('ct-role') || 'pro')

  useEffect(() => {
    localStorage.setItem('ct-role', role)
  }, [role])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
