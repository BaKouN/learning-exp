"use client"

import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(5) // Default to 5 slides
  const [slideContent, setSlideContent] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    // In Next.js, client-side env vars need NEXT_PUBLIC_ prefix
    // Try both NEXT_PUBLIC_ and REACT_APP_ for compatibility
    const serverUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.REACT_APP_WS_URL || "https://mon-ws-server-b00da40a55c9.herokuapp.com"

    console.log("Available env vars:", {
      processEnv: process.env,
      NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
      REACT_APP_WS_URL: process.env.REACT_APP_WS_URL,
      NODE_ENV: process.env.NODE_ENV,
    })
    console.log("Connecting to:", serverUrl)

    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      transports: ["websocket", "polling"], // Allow fallback to polling
      timeout: 20000,
      forceNew: true,
    })

    // Connection event handlers
    socketRef.current.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to server:", serverUrl)
      console.log("Socket ID:", socketRef.current.id)
      // Request initial presentation state
      socketRef.current.emit("get-presentation-state")
    })

    socketRef.current.on("disconnect", (reason) => {
      setIsConnected(false)
      console.log("Disconnected from server:", reason)
    })

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error)
      setIsConnected(false)
    })

    // Slide-specific event handlers
    socketRef.current.on("slide-changed", (data) => {
      console.log("Slide changed:", data)
      setCurrentSlide(data.currentSlide || 0)
      setTotalSlides(data.totalSlides || 5)
      if (data.slideContent) {
        setSlideContent(data.slideContent)
      }
    })

    socketRef.current.on("slide-content-updated", (content) => {
      console.log("Slide content updated:", content)
      setSlideContent(content)
    })

    socketRef.current.on("presentation-initialized", (data) => {
      console.log("Presentation initialized:", data)
      setCurrentSlide(data.currentSlide || 0)
      setTotalSlides(data.totalSlides || 5)
      setSlideContent(data.slideContent)
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const goToSlide = (slideNumber) => {
    if (socketRef.current && isConnected && slideNumber >= 0 && slideNumber < totalSlides) {
      console.log("Going to slide:", slideNumber)
      socketRef.current.emit("go-to-slide", slideNumber)
    }
  }

  const nextSlide = () => {
    if (socketRef.current && isConnected && currentSlide < totalSlides - 1) {
      console.log("Going to next slide")
      socketRef.current.emit("next-slide")
    }
  }

  const prevSlide = () => {
    if (socketRef.current && isConnected && currentSlide > 0) {
      console.log("Going to previous slide")
      socketRef.current.emit("prev-slide")
    }
  }

  const updateSlideContent = (content) => {
    if (socketRef.current && isConnected) {
      console.log("Updating slide content:", content)
      socketRef.current.emit("update-slide-content", {
        slideNumber: currentSlide,
        content,
      })
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    currentSlide,
    totalSlides,
    slideContent,
    goToSlide,
    nextSlide,
    prevSlide,
    updateSlideContent,
  }
}
