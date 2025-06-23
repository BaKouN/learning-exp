"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const envVars = {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    REACT_APP_WS_URL: process.env.REACT_APP_WS_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Panel</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-6 w-6 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Environment Variables:</h4>
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-xs">
                <span className="font-mono">{key}:</span>
                <span className={`font-mono ${value ? "text-green-600" : "text-red-600"}`}>{value || "undefined"}</span>
              </div>
            ))}
            <div className="mt-3 p-2 bg-muted rounded text-xs">
              <p className="font-medium mb-1">Next.js Environment Variables:</p>
              <p>• Client-side: Use NEXT_PUBLIC_ prefix</p>
              <p>• Server-side: Any variable name works</p>
              <p>• Add to .env.local file in project root</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
