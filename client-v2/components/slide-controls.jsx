"use client"

import { usePresentation } from "../contexts/presentation-context.js"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react"

export function SlideControls() {
  const { currentSlide, totalSlides, goToSlide, nextSlide, prevSlide, isConnected } = usePresentation()

  const canGoPrev = currentSlide > 0
  const canGoNext = currentSlide < totalSlides - 1

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToSlide(0)}
        disabled={!isConnected || currentSlide === 0}
        title="Go to first slide"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={prevSlide}
        disabled={!isConnected || !canGoPrev}
        title="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="px-4 py-2 text-sm font-medium bg-muted rounded">
        {currentSlide + 1} / {totalSlides}
      </span>

      <Button variant="outline" size="sm" onClick={nextSlide} disabled={!isConnected || !canGoNext} title="Next slide">
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToSlide(totalSlides - 1)}
        disabled={!isConnected || currentSlide === totalSlides - 1}
        title="Go to last slide"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  )
}
