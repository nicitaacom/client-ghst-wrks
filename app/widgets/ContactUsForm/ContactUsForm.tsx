"use client"

import { Input } from "@/components/Input"
import { businessInfo } from "@/consts/businessInfo"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { contactUsAction } from "./actions/contactUsAction"

interface ContactFormData {
  name: string
  phone: string
  message: string
}

interface ValidationErrors {
  name?: string
  phone?: string
  message?: string
}

const GhostCanvas = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawGhost()
    }

    // 1. Draw ghost with eyes
    const drawGhost = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      // Ghost body
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
      ctx.beginPath()

      const centerX = width * 0.7
      const centerY = height * 0.6
      const radius = Math.min(width, height) * 0.15

      // Ghost head (circle)
      ctx.arc(centerX, centerY - radius * 0.3, radius, Math.PI, 0, false)

      // Ghost body (wavy bottom)
      ctx.lineTo(centerX + radius, centerY + radius * 0.8)

      // Wavy bottom edge
      for (let i = 0; i < 6; i++) {
        const x = centerX + radius - (i * radius * 2) / 5
        const y = centerY + radius * 0.8 + Math.sin((i * Math.PI) / 3) * radius * 0.2
        ctx.lineTo(x, y)
      }

      ctx.lineTo(centerX - radius, centerY + radius * 0.8)
      ctx.closePath()
      ctx.fill()

      // Ghost outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Eyes
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"

      // Left eye
      ctx.beginPath()
      ctx.arc(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.12, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.beginPath()
      ctx.arc(centerX + radius * 0.3, centerY - radius * 0.2, radius * 0.12, 0, Math.PI * 2)
      ctx.fill()

      // Eye pupils
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
      ctx.beginPath()
      ctx.arc(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.05, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(centerX + radius * 0.3, centerY - radius * 0.2, radius * 0.05, 0, Math.PI * 2)
      ctx.fill()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className={twMerge("absolute inset-0 pointer-events-none", className)} />
}

export function ContactUsForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "+44 ",
    message: "",
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // 1. Format phone number with mask +XX XXX XXX XX XX
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // If empty, return +44 prefix
    if (digits.length === 0) return "+44 "

    // Start with +44 if user hasn't provided country code
    let formattedDigits = digits.startsWith("44") ? digits : "44" + digits

    // Format as +XX XXX XXX XX XX
    if (formattedDigits.length <= 2) return `+${formattedDigits}`
    if (formattedDigits.length <= 5) return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2)}`
    if (formattedDigits.length <= 8)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5)}`
    if (formattedDigits.length <= 10)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8)}`

    return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8, 10)} ${formattedDigits.slice(10, 12)}`
  }

  // 2. Validation functions
  const validateName = (value: string): string | undefined =>
    value.length < 2 ? "Name must be at least 2 characters" : undefined

  const validatePhone = (value: string): string | undefined =>
    value.replace(/\D/g, "").length < 10 ? "Please enter a valid phone number" : undefined

  const validateMessage = (value: string): string | undefined =>
    value.length < 3 ? "Message must be at least 3 characters" : undefined

  // 3. Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      const formatted = formatPhoneNumber(value)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // 4. Clear error on type
    errors[name as keyof ValidationErrors] && setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  // 5. Handle phone input key events
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39].includes(e.keyCode)) return
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) return
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 6. Validate all fields
    const newErrors: ValidationErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
    }
    setErrors(newErrors)
    setErrorMessage("")
    setSuccessMessage("")

    // 7. Submit if valid
    if (!Object.values(newErrors).some(error => error)) {
      try {
        await contactUsAction(formData.name, formData.phone, formData.message)
        setSuccessMessage("We will respond ASAP")
      } catch (error) {
        if (error instanceof Error) setErrorMessage(`Failed to send message. ${error.message}`)
        else setErrorMessage(`Failed to send message. ${String(error)}`)
      }
    }
  }

  const isFormValid = formData.name && formData.phone.length >= 7 && formData.message

  return (
    <div className="w-full max-w-[500px] relative">
      {/* Canvas background */}
      <GhostCanvas />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-foreground/50 backdrop-blur-sm rounded-xl border border-ghost-secondary p-4 mobile:p-6 relative overflow-hidden shadow-2xl">
        {/* Ghost decorations */}
        <div className="absolute top-3 right-3 opacity-10">
          <Image src="/ghost-2.png" alt="form ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
        </div>
        <div className="absolute bottom-3 left-3 opacity-5">
          <Image src="/ghost-6.png" alt="form ghost" width={24} height={24} className="w-6 h-6 animate-pulse" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-1 h-8 bg-ghost-primary rounded-full shadow-sm shadow-ghost-primary/20" />
          <div className="flex items-center gap-2">
            <h1 className="text-title text-xl mobile:text-2xl font-bold">Contact us</h1>
            <Image
              src="/ghost-1.png"
              alt="ghost"
              width={24}
              height={24}
              className="w-5 h-5 mobile:w-6 mobile:h-6 opacity-30 animate-pulse"
            />
          </div>
        </div>

        {/* Name and Contact fields */}
        <div className="grid grid-cols-1 mobile:grid-cols-[35%,65%] gap-3 relative z-10">
          <div className="relative group">
            <label className="flex items-center gap-2 text-sm font-medium text-subTitle mb-2" htmlFor="name">
              My name is
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="James"
              className={twMerge(
                "w-full bg-foreground-accent/50 backdrop-blur-sm text-title border rounded-lg px-3 py-2 text-sm transition-all duration-300 placeholder:text-subTitle/70 outline-none",
                focusedField === "name"
                  ? "border-ghost-primary/60 shadow-[0_0_20px_theme(colors.ghost-primary/20)] bg-ghost-primary/5 ring-2 ring-ghost-primary/30"
                  : "border-ghost-secondary/40 hover:border-ghost-primary/40 hover:bg-ghost-primary/5",
              )}
            />
            {/* Ghost focus indicator */}
            {focusedField === "name" && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ghost-primary/20 via-transparent to-ghost-primary/20 rounded-lg animate-pulse pointer-events-none" />
            )}
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="relative group">
            <label className="flex items-center gap-2 text-sm font-medium text-subTitle mb-2" htmlFor="phone">
              How do we contact you?
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onKeyDown={handlePhoneKeyDown}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              placeholder="+44 124 555 42 11"
              maxLength={17}
              className={twMerge(
                "w-full bg-foreground-accent/50 backdrop-blur-sm text-title border rounded-lg px-3 py-2 text-sm transition-all duration-300 placeholder:text-subTitle/70 outline-none font-mono",
                focusedField === "phone"
                  ? "border-ghost-primary/60 shadow-[0_0_20px_theme(colors.ghost-primary/20)] bg-ghost-primary/5 ring-2 ring-ghost-primary/30"
                  : "border-ghost-secondary/40 hover:border-ghost-primary/40 hover:bg-ghost-primary/5",
              )}
            />
            {/* Ghost focus indicator */}
            {focusedField === "phone" && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ghost-primary/20 via-transparent to-ghost-primary/20 rounded-lg animate-pulse pointer-events-none" />
            )}
            {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Message field */}
        <div className="relative z-10 group">
          <label className="flex items-center gap-2 text-sm font-medium text-subTitle mb-2" htmlFor="message">
            I want
            <Image
              src="/ghost-4-5.png"
              alt="ghost"
              width={16}
              height={16}
              className="w-4 h-4 opacity-20 animate-pulse"
            />
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            placeholder={businessInfo.cta}
            className={twMerge(
              "w-full bg-foreground-accent/50 backdrop-blur-sm text-title border rounded-lg px-3 py-2 text-sm transition-all duration-300 min-h-[80px] mobile:min-h-[100px] resize-none placeholder:text-subTitle/70 outline-none",
              focusedField === "message"
                ? "border-ghost-primary/60 shadow-[0_0_20px_theme(colors.ghost-primary/20)] bg-ghost-primary/5 ring-2 ring-ghost-primary/30"
                : "border-ghost-secondary/40 hover:border-ghost-primary/40 hover:bg-ghost-primary/5",
            )}
          />
          {/* Ghost focus indicator */}
          {focusedField === "message" && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-ghost-primary/20 via-transparent to-ghost-primary/20 rounded-lg animate-pulse pointer-events-none" />
          )}
          {errors.message && <p className="text-danger text-xs mt-1">{errors.message}</p>}
        </div>

        {/* Status messages */}
        {(errorMessage || successMessage) && (
          <div className="relative z-10">
            {errorMessage && (
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 flex items-center gap-2">
                <span className="text-danger">❌</span>
                <p className="text-danger text-sm">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-2">
                <span className="text-success">✅</span>
                <p className="text-success text-sm">{successMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Submit button and booking link */}
        <div className="flex flex-col gap-3 relative z-10">
          <button
            type="submit"
            disabled={!isFormValid}
            className={twMerge(
              "w-full bg-ghost-primary/90 hover:bg-ghost-primary text-title-foreground px-4 py-3 mobile:py-4 font-semibold rounded-lg transition-all duration-200 shadow-lg relative group overflow-hidden text-sm mobile:text-base",
              isFormValid
                ? "hover:shadow-[0_0_25px_theme(colors.ghost-primary/40)] active:scale-[0.98] hover:shadow-ghost-primary/25"
                : "opacity-50 cursor-not-allowed",
            )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ghost-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            <div className="flex items-center justify-center gap-2 relative z-10">
              <span>Contact us - get response in 2mins</span>
              <Image
                src="/ghost-3.png"
                alt="ghost"
                width={16}
                height={16}
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity group-hover:animate-pulse"
              />
            </div>
          </button>

          {/* 8. Booking link */}
          <Link
            href="/booking"
            className="w-full bg-foreground-accent/50 hover:bg-ghost-primary/20 backdrop-blur-sm text-title border border-ghost-secondary/40 hover:border-ghost-primary/40 px-4 py-3 mobile:py-4 font-semibold rounded-lg transition-all duration-200 shadow-sm relative group overflow-hidden text-sm mobile:text-base text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ghost-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            <div className="flex items-center justify-center gap-2 relative z-10">
              <span>Go to booking</span>
              <Image
                src="/ghost-1.png"
                alt="ghost"
                width={16}
                height={16}
                className="w-4 h-4 opacity-50 group-hover:opacity-70 transition-opacity group-hover:animate-pulse"
              />
            </div>
            {/* Ghost focus indicator for link */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-ghost-primary/10 via-transparent to-ghost-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </Link>
        </div>

        {/* Ghost gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ghost-primary/5 via-transparent to-ghost-primary/5 pointer-events-none rounded-xl" />

        {/* Floating ghost particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-1 h-1 bg-ghost-primary/30 rounded-full animate-ping"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-3/4 right-1/3 w-1 h-1 bg-ghost-primary/20 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-ghost-primary/25 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </form>
    </div>
  )
}
