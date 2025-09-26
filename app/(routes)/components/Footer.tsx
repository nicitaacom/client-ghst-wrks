"use client"

import { businessInfo } from "@/consts/businessInfo"
import Image from "next/image"
import Link from "next/link"
import { formatPhoneNumber } from "../utils/formatPhoneNumber"
import { twMerge } from "tailwind-merge"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface BusinessHours {
  [key: string]: { opens: string; closes: string } | null
}

interface BusinessHoursProps {
  businessHours: BusinessHours
  className?: string
}

// Animated ghost particles using CSS
function FloatingGhosts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/5 rounded-full blur-sm"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * 200 + 50,
          }}
          animate={{
            x: [
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            ],
            y: [Math.random() * 100 + 50, Math.random() * 100 + 100, Math.random() * 100 + 50],
            opacity: [0.02, 0.05, 0.01, 0.03, 0.02],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  )
}

function BusinessHours({ businessHours, className }: BusinessHoursProps) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1, 3)

  const groupedHours = Object.entries(businessHours).reduce(
    (acc, [day, hours]) => {
      const key = hours ? `${hours.opens}-${hours.closes}` : "closed"
      acc[key] = acc[key] ? [...acc[key], day] : [day]
      return acc
    },
    {} as Record<string, string[]>,
  )

  const displayGroups = Object.entries(groupedHours).map(([key, days]) => {
    const isClosed = key === "closed"
    const [opens, closes] = isClosed ? ["", ""] : key.split("-")
    const dayRange =
      days.length > 1 ? `${capitalize(days[0])}-${capitalize(days[days.length - 1])}` : capitalize(days[0])
    return { dayRange, opens, closes, isClosed }
  })

  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  displayGroups.sort((a, b) => {
    const aDay = a.dayRange.split("-")[0].toLowerCase()
    const bDay = b.dayRange.split("-")[0].toLowerCase()
    return dayOrder.indexOf(aDay) - dayOrder.indexOf(bDay)
  })

  return (
    <div className={twMerge("text-sm text-subTitle space-y-1 opacity-80", className)}>
      {displayGroups.map(({ dayRange, opens, closes, isClosed }, index) => (
        <p key={index} className="hover:opacity-100 transition-opacity">
          {dayRange}: {isClosed ? "Closed" : `${opens} - ${closes}`}
        </p>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 relative overflow-hidden">
      {/* Ghost Canvas Background */}
      <FloatingGhosts />

      {/* Very subtle ghost images */}
      <div className="absolute top-4 left-4 opacity-[0.02]">
        <Image src="/ghost-1.png" alt="ambient ghost" width={60} height={60} className="w-15 h-15" />
      </div>
      <div className="absolute bottom-4 right-20 opacity-[0.02]">
        <Image src="/ghost-6.png" alt="ambient ghost" width={40} height={40} className="w-10 h-10" />
      </div>

      {/* Main chill ghost on the right */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden laptop:block">
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [-2, 2, -2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <Image
            src="/ghost-3.png"
            alt="chill ghost"
            width={120}
            height={120}
            className="w-30 h-30 filter drop-shadow-lg"
          />
        </motion.div>
      </div>

      <div className="flex flex-col laptop:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex flex-col laptop:flex-row gap-8 laptop:gap-16">
          {/* LOGO */}
          <div className="flex flex-col items-center gap-3 group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <Image
                  src="/ghost-4-5.png"
                  alt="logo ghost"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wider">GHST WRKS</h1>
              <div className="opacity-[0.02]">
                <Image src="/ghost-2.png" alt="logo ambient" width={24} height={24} className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/40 text-xs italic text-center">"We are transparent with you as ghosts"</p>
          </div>

          {/* BUSINESS HOURS */}
          <div className="relative">
            <BusinessHours businessHours={businessInfo.businessHours} />
            <div className="absolute -top-2 -right-2 opacity-[0.02]">
              <Image src="/ghost-6.png" alt="hours ghost" width={20} height={20} className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col laptop:flex-row gap-8">
          {/* LEGAL LINKS */}
          <div className="flex flex-col items-center gap-3 relative">
            <Link
              className="text-white/60 hover:text-white text-sm transition-colors hover:scale-105 transform duration-200"
              href="/terms-of-service">
              Terms of Service
            </Link>
            <Link
              className="text-white/60 hover:text-white text-sm transition-colors hover:scale-105 transform duration-200"
              href="/privacy-policy">
              Privacy Policy
            </Link>
            <div className="absolute -bottom-1 -left-1 opacity-[0.02]">
              <Image src="/ghost-1.png" alt="legal ghost" width={16} height={16} className="w-4 h-4" />
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col items-center laptop:items-start gap-3 relative">
            <div className="flex items-center gap-2 group">
              <div className="w-5 h-5 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <Image
                  className="w-3 h-3 filter brightness-0 invert opacity-70"
                  src="/phone.svg"
                  alt="phone"
                  width={12}
                  height={12}
                />
              </div>
              <span className="text-white text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                {formatPhoneNumber(businessInfo.phone)}
              </span>
            </div>

            <div className="flex items-center gap-2 group">
              <div className="w-5 h-5 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <Image
                  className="w-3 h-3 filter brightness-0 invert opacity-70"
                  src="/email.svg"
                  alt="email"
                  width={12}
                  height={12}
                />
              </div>
              <span className="text-white text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                {businessInfo.email}
              </span>
            </div>

            <div className="absolute -top-1 -right-1 opacity-[0.02]">
              <Image src="/ghost-4-5.png" alt="contact ghost" width={18} height={18} className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tagline - removed since it's now in logo section */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 opacity-[0.02]">
        <Image src="/ghost-3.png" alt="bottom ghost" width={20} height={20} className="w-5 h-5" />
      </div>

      {/* Subtle horror gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </footer>
  )
}
