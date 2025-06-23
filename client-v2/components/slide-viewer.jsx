"use client"

import { usePresentation } from "../contexts/presentation-context.js"
import { Card, CardContent } from "@/components/ui/card"

export function SlideViewer() {
  const { currentSlide, totalSlides, slideContent, isConnected } = usePresentation()

  if (!isConnected) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Connecting to presentation...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-96">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Slide {currentSlide + 1} of {totalSlides}
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-muted rounded-lg p-8">
          {slideContent ? (
            <div className="text-center max-w-full">
              <h3 className="text-2xl font-bold mb-4">{slideContent.title || `Slide ${currentSlide + 1}`}</h3>
              <p className="text-muted-foreground mb-4">{slideContent.content || "Slide content goes here..."}</p>
              {slideContent.image && (
                <img
                  src={slideContent.image || "/placeholder.svg"}
                  alt="Slide content"
                  className="mt-4 max-w-full h-auto rounded-lg mx-auto"
                  style={{ maxHeight: "200px" }}
                />
              )}
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Slide {currentSlide + 1}</h3>
              <p className="text-muted-foreground">Waiting for slide content...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
