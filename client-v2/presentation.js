"use client"

import { PresentationProvider } from "./contexts/presentation-context"
import { SlideViewer } from "./components/slide-viewer"
import { SlideControls } from "./components/slide-controls"
import { SlideNavigator } from "./components/slide-navigator"
import { ConnectionStatus } from "./components/connection-status"

export default function Presentation() {
  return (
    <PresentationProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold mb-2">Interactive Presentation</h1>
            <p className="text-muted-foreground">Real-time synchronized slides with Socket.IO</p>
          </header>

          <ConnectionStatus />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <SlideViewer />
              <div className="mt-4">
                <SlideControls />
              </div>
            </div>

            <div className="lg:col-span-1">
              <SlideNavigator />
            </div>
          </div>
        </div>
      </div>
    </PresentationProvider>
  )
}
