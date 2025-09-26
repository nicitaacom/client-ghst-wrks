"use client"

import { useEffect, useRef, ReactNode } from "react"

interface GhostCanvasWrapperProps {
  children: ReactNode
}

export function GhostCanvasWrapper({ children }: GhostCanvasWrapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Ghost entities with brand color glares
    const ghosts: {
      x: number
      y: number
      vx: number
      vy: number
      opacity: number
      size: number
      glareOpacity: number
      glarePhase: number
      waveOffset: number
      waveAmplitude: number
    }[] = []

    // Create ghost entities
    for (let i = 0; i < 5; i++) {
      ghosts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.15 + 0.05,
        size: Math.random() * 60 + 40,
        glareOpacity: 0,
        glarePhase: Math.random() * Math.PI * 2,
        waveOffset: Math.random() * Math.PI * 2,
        waveAmplitude: Math.random() * 15 + 5,
      })
    }

    // Wave effects for UI interaction
    const waves: {
      x: number
      y: number
      radius: number
      opacity: number
      expanding: boolean
    }[] = []

    const createWave = (x: number, y: number) => {
      if (Math.random() < 0.3) {
        // 30% chance
        waves.push({
          x,
          y,
          radius: 0,
          opacity: 0.8,
          expanding: true,
        })
      }
    }

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Random wave creation near mouse
      if (Math.random() < 0.02) {
        createWave(mouseX + (Math.random() - 0.5) * 100, mouseY + (Math.random() - 0.5) * 100)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    const drawGhostForm = (x: number, y: number, size: number, opacity: number) => {
      const ghostHeight = size * 1.2
      const ghostWidth = size

      ctx.beginPath()
      // Head (semi-circle)
      ctx.arc(x, y - ghostHeight * 0.3, ghostWidth * 0.5, Math.PI, 0, false)

      // Body (rectangle with wavy bottom)
      ctx.lineTo(x + ghostWidth * 0.5, y + ghostHeight * 0.3)

      // Wavy bottom edge
      const waveCount = 4
      const waveWidth = ghostWidth / waveCount
      for (let i = 0; i < waveCount; i++) {
        const waveX = x - ghostWidth * 0.5 + (i + 0.5) * waveWidth
        const waveY = y + ghostHeight * 0.3 + Math.sin(Date.now() * 0.003 + i) * 5

        if (i === 0) {
          ctx.lineTo(waveX, waveY)
        } else {
          ctx.quadraticCurveTo(x - ghostWidth * 0.5 + i * waveWidth, y + ghostHeight * 0.3, waveX, waveY)
        }
      }

      ctx.lineTo(x - ghostWidth * 0.5, y + ghostHeight * 0.3)
      ctx.closePath()

      // Fill ghost with subtle white
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.fill()

      // Add inner glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.6})`)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Eyes
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 2})`
      ctx.beginPath()
      ctx.arc(x - size * 0.15, y - ghostHeight * 0.4, size * 0.05, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x + size * 0.15, y - ghostHeight * 0.4, size * 0.05, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawBrandGlare = (x: number, y: number, size: number, opacity: number) => {
      // Brand color glare (smoky white with slight warm tint)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      gradient.addColorStop(0, `rgba(245, 245, 240, ${opacity})`) // Smoky white
      gradient.addColorStop(0.5, `rgba(240, 240, 235, ${opacity * 0.5})`)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawWave = (wave: (typeof waves)[0]) => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
      ctx.stroke()

      // Inner ripple
      if (wave.radius > 20) {
        ctx.strokeStyle = `rgba(245, 245, 240, ${wave.opacity * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(wave.x, wave.y, wave.radius * 0.6, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw ghosts
      ghosts.forEach((ghost, index) => {
        // Update position with wave-like movement
        ghost.x += ghost.vx + Math.sin(Date.now() * 0.001 + ghost.waveOffset) * 0.1
        ghost.y += ghost.vy + Math.cos(Date.now() * 0.0015 + ghost.waveOffset) * 0.1

        // Wrap around screen edges
        if (ghost.x < -ghost.size) ghost.x = canvas.width + ghost.size
        if (ghost.x > canvas.width + ghost.size) ghost.x = -ghost.size
        if (ghost.y < -ghost.size) ghost.y = canvas.height + ghost.size
        if (ghost.y > canvas.height + ghost.size) ghost.y = -ghost.size

        // Update glare phase
        ghost.glarePhase += 0.02
        ghost.glareOpacity = Math.sin(ghost.glarePhase) * 0.3 + 0.1

        // Draw brand glare first (behind ghost)
        if (ghost.glareOpacity > 0.2) {
          drawBrandGlare(ghost.x, ghost.y, ghost.size, ghost.glareOpacity * 0.15)
        }

        // Draw ghost form
        drawGhostForm(ghost.x, ghost.y, ghost.size, ghost.opacity * 0.8)

        // Interaction with mouse
        const distToMouse = Math.sqrt(Math.pow(ghost.x - mouseX, 2) + Math.pow(ghost.y - mouseY, 2))

        if (distToMouse < 150) {
          // Ghost reacts to mouse proximity
          const repelForce = 0.5
          const angle = Math.atan2(ghost.y - mouseY, ghost.x - mouseX)
          ghost.vx += Math.cos(angle) * repelForce * 0.01
          ghost.vy += Math.sin(angle) * repelForce * 0.01

          // Enhanced glare when near mouse
          drawBrandGlare(ghost.x, ghost.y, ghost.size, 0.2)
        }

        // Damping to prevent infinite acceleration
        ghost.vx *= 0.99
        ghost.vy *= 0.99
      })

      // Update and draw waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i]

        if (wave.expanding) {
          wave.radius += 2
          wave.opacity -= 0.015

          if (wave.opacity <= 0 || wave.radius > 100) {
            waves.splice(i, 1)
          }
        }

        if (wave.opacity > 0) {
          drawWave(wave)
        }
      }

      // Random wave generation
      if (Math.random() < 0.005) {
        createWave(Math.random() * canvas.width, Math.random() * canvas.height)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
