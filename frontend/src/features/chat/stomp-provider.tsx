import * as React from "react"
import { createContext, useEffect, useState } from "react"
import { client } from "@/lib/stomp.ts"

const StompContext = createContext(false)

function StompProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    client.onConnect = () => {
      setConnected(true)
      console.log("Connected to STOMP broker successfully!")
    }

    client.onWebSocketClose = () => {
      setConnected(false)
      console.log("Disconnected from STOMP broker")
    }

    client.onStompError = (frame) => {
      setConnected(false)
      console.error("STOMP error:", frame.headers["message"], frame.body)
    }
    
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [])

  return (
    <StompContext.Provider value={connected}>{children}</StompContext.Provider>
  )
}

export { StompContext, StompProvider }
