"use client"

import { usePresentation } from "../contexts/presentation-context.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function SlideNavigator() {
  const { currentSlide, totalSlides, goToSlide, isConnected } = usePresentation()

  if (!isConnected || totalSlides === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-3">Slide Navigator</h3>
          <p className="text-sm text-muted-foreground">{!isConnected ? "Not connected" : "No slides available"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Slide Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <Button
              key={index}
              variant={currentSlide === index ? "default" : "outline"}
              size="sm"
              onClick={() => goToSlide(index)}
              className="aspect-square p-0 text-xs"
              title={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
