"use client"

import { usePresentation } from "../contexts/presentation-context.js"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react"

export function ConnectionStatus() {
  const { isConnected } = usePresentation()

  // Check both possible environment variables
  const nextPublicUrl = process.env.NEXT_PUBLIC_WS_URL
  const reactAppUrl = process.env.REACT_APP_WS_URL
  const serverUrl = nextPublicUrl || reactAppUrl || "Not configured"

  const hasValidUrl = nextPublicUrl || reactAppUrl

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          <div className="flex-1">
            <p className="font-medium">{isConnected ? "Connected" : "Disconnected"}</p>
            <p className="text-sm text-muted-foreground">Server: {serverUrl}</p>
            {nextPublicUrl && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Using NEXT_PUBLIC_WS_URL
              </p>
            )}
            {!nextPublicUrl && reactAppUrl && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Using REACT_APP_WS_URL (consider switching to NEXT_PUBLIC_WS_URL)
              </p>
            )}
          </div>
          {!hasValidUrl && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">No URL configured</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
