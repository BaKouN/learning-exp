"use client"

import { createContext, useContext } from "react"
import { useSocket } from "../hooks/use-socket.js"

const PresentationContext = createContext(undefined)

export function PresentationProvider({ children }) {
  const socketData = useSocket()

  return <PresentationContext.Provider value={socketData}>{children}</PresentationContext.Provider>
}

export function usePresentation() {
  const context = useContext(PresentationContext)
  if (context === undefined) {
    throw new Error("usePresentation must be used within a PresentationProvider")
  }
  return context
}