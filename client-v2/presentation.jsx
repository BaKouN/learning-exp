"use client"

import { PresentationProvider } from "./contexts/presentation-context.js"
import { SlideViewer } from "./components/slide-viewer.jsx"
import { SlideControls } from "./components/slide-controls.jsx"
import { SlideNavigator } from "./components/slide-navigator.jsx"
import { ConnectionStatus } from "./components/connection-status.jsx"
import { DebugPanel } from "./components/debug-panel.jsx"

export default function Presentation() {
  return (
    <PresentationProvider>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Interactive Presentation</h1>
            <p className="text-muted-foreground">Real-time synchronized slides with Socket.IO</p>
          </header>

          <ConnectionStatus />
          <DebugPanel />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <SlideViewer />
              <SlideControls />
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
