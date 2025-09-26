"use client"

import { consts } from "@/consts/consts"
import Image from "next/image"
import Link from "next/link"
import { timeAgo } from "../utils/timeAgo"
import { businessInfo } from "@/consts/businessInfo"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"

interface SocialItemProps {
  className?: string
  usrAvatarUrl: string
  username: string
  date: string
  reviewMessage: string
  amountOfStarts: number
  index: number
  isStolen: boolean
  isTargetForStealing: boolean
  onSteal: () => void
}

type GlitchType = "fade" | "flicker" | "disappear" | "float"

function GoogleReview({
  className,
  usrAvatarUrl,
  username,
  date,
  amountOfStarts,
  reviewMessage,
  index,
  isStolen,
  isTargetForStealing,
  onSteal,
}: SocialItemProps) {
  const maxChars = 100
  const isTruncated = reviewMessage.length > maxChars
  const displayedText = isTruncated ? reviewMessage.substring(0, maxChars) + "..." : reviewMessage

  const [glitchState, setGlitchState] = useState<{
    type: GlitchType
    active: boolean
    opacity: number
    transform: { x: number; y: number; scale: number }
  }>({
    type: "fade",
    active: false,
    opacity: 1,
    transform: { x: 0, y: 0, scale: 1 },
  })

  const [showStealingGhost, setShowStealingGhost] = useState(false)

  useEffect(() => {
    if (isTargetForStealing) {
      // Start the stealing animation after 2 seconds
      const stealTimeout = setTimeout(() => {
        setShowStealingGhost(true)

        // Ghost appears and steals the review
        setTimeout(() => {
          onSteal()
          setShowStealingGhost(false)
        }, 2000)
      }, 2000)

      return () => clearTimeout(stealTimeout)
    }
  }, [isTargetForStealing, onSteal])

  useEffect(() => {
    if (isStolen || isTargetForStealing) return

    // Random glitch effects with TypeScript random selection
    const glitchTypes: GlitchType[] = ["fade", "flicker", "disappear", "float"]

    const createGlitchEffect = () => {
      const randomType: GlitchType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)]
      const shouldAnimate = Math.random() < 0.008 // 0.8% chance

      if (!shouldAnimate) return

      setGlitchState(prev => ({ ...prev, active: true, type: randomType }))

      switch (randomType) {
        case "fade":
          setGlitchState(prev => ({
            ...prev,
            opacity: Math.random() * 0.3 + 0.2,
            transform: { x: 0, y: 0, scale: 1 },
          }))
          setTimeout(
            () => {
              setGlitchState(prev => ({ ...prev, active: false, opacity: 1 }))
            },
            Math.random() * 2000 + 1000,
          )
          break

        case "flicker":
          let flickerCount = 0
          const maxFlickers = Math.floor(Math.random() * 5) + 3
          const flickerInterval = setInterval(() => {
            setGlitchState(prev => ({
              ...prev,
              opacity: prev.opacity === 1 ? 0.1 : 1,
            }))
            flickerCount++
            if (flickerCount >= maxFlickers) {
              clearInterval(flickerInterval)
              setGlitchState(prev => ({ ...prev, active: false, opacity: 1 }))
            }
          }, 150)
          break

        case "disappear":
          // Immediate disappear without ease
          setGlitchState(prev => ({
            ...prev,
            opacity: 0,
            transform: { x: 0, y: 0, scale: 1 },
          }))
          setTimeout(() => {
            setGlitchState(prev => ({ ...prev, active: false, opacity: 1 }))
          }, 3000)
          break

        case "float":
          const floatY = (Math.random() - 0.5) * 20
          const floatX = (Math.random() - 0.5) * 10
          const scale = Math.random() * 0.2 + 0.9

          setGlitchState(prev => ({
            ...prev,
            transform: { x: floatX, y: floatY, scale },
            opacity: Math.random() * 0.4 + 0.6,
          }))
          setTimeout(
            () => {
              setGlitchState(prev => ({
                ...prev,
                active: false,
                opacity: 1,
                transform: { x: 0, y: 0, scale: 1 },
              }))
            },
            Math.random() * 3000 + 2000,
          )
          break
      }
    }

    const glitchInterval = setInterval(createGlitchEffect, 300)
    return () => clearInterval(glitchInterval)
  }, [isStolen, isTargetForStealing])

  if (isStolen) {
    return (
      <motion.li
        className="min-w-[300px] flex flex-col bg-black/60 backdrop-blur-sm rounded-xl border border-red-900/30 p-4 relative overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}>
        <div className="flex items-center justify-center h-40 opacity-40">
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1, ease: "easeOut" }}>
            <Image src="/ghost-1.png" alt="stolen ghost" width={64} height={64} className="w-16 h-16" />
          </motion.div>
          <motion.p
            className="text-red-400/70 text-sm ml-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            Review stolen by ghost...
          </motion.p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-black/20 pointer-events-none rounded-xl" />
      </motion.li>
    )
  }

  return (
    <motion.li
      className="min-w-[300px] flex flex-col bg-foreground-accent/30 backdrop-blur-sm hover:bg-white/5 rounded-xl 
      border border-white/10 hover:border-white/20 p-4 duration-200 transition-all relative overflow-hidden"
      style={{
        opacity: glitchState.opacity,
        transform: `translate(${glitchState.transform.x}px, ${glitchState.transform.y}px) scale(${glitchState.transform.scale})`,
      }}
      animate={
        glitchState.type === "float" && glitchState.active
          ? {
              y: [0, -5, 0],
            }
          : {}
      }
      transition={
        glitchState.type === "disappear"
          ? { duration: 0 }
          : {
              duration: glitchState.type === "float" ? 4 : 0.5,
              repeat: glitchState.type === "float" && glitchState.active ? Infinity : 0,
            }
      }>
      {/* Ghost stealing animation overlay */}
      <AnimatePresence>
        {showStealingGhost && (
          <motion.div
            className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <motion.div
              initial={{
                x: 100,
                y: 100,
                scale: 0.2,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                scale: 1.2,
                rotate: [-10, 10, -5, 0],
                opacity: [0, 0.3, 0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
              }}>
              <Image
                src="/ghost-2.png"
                alt="stealing ghost"
                width={80}
                height={80}
                className="w-20 h-20 filter drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spooky background effects */}
      <div className="absolute top-1 right-1 opacity-5">
        <motion.div
          animate={
            glitchState.active
              ? {
                  opacity: [0.05, 0.15, 0.05],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}>
          <Image src="/ghost-6.png" alt="bg ghost" width={24} height={24} className="w-6 h-6" />
        </motion.div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                className="w-10 h-10 rounded-full border-2 border-white/20 opacity-80"
                src={usrAvatarUrl}
                alt="user avatar"
                width={40}
                height={40}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
            </div>
            <div>
              <h5 className="text-title font-semibold text-sm opacity-90">{username}</h5>
              <p className="text-subTitle text-xs opacity-70">{timeAgo(date)}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded border border-white/10">
            <Image src="/google.svg" alt="google" width={16} height={16} className="opacity-70" />
          </div>
        </div>

        <div className="flex gap-1">
          {Array(amountOfStarts)
            .fill(0)
            .map((_, starIndex) => (
              <Image key={starIndex} className="w-4 h-4 opacity-80" src="/star.svg" alt="star" width={16} height={16} />
            ))}
        </div>
      </div>

      <p className="text-title text-sm leading-relaxed opacity-85 relative z-10">
        {displayedText}
        {isTruncated && (
          <Link
            className="text-white hover:text-white/80 inline ml-1 font-medium opacity-70 hover:opacity-100 transition-opacity"
            href={businessInfo.mapUrl}>
            more
          </Link>
        )}
      </p>

      {/* Subtle horror glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-red-900/5 pointer-events-none rounded-xl" />
    </motion.li>
  )
}

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [stolenReviewIndex, setStolenReviewIndex] = useState<number | null>(null)
  const [targetReviewIndex, setTargetReviewIndex] = useState<number | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (isInView && !hasInitialized) {
      // Select one random review to be stolen after component comes into view
      const randomIndex = Math.floor(Math.random() * consts.reviews.length)
      setTargetReviewIndex(randomIndex)
      setHasInitialized(true)
    }
  }, [isInView, hasInitialized])

  const handleSteal = () => {
    if (targetReviewIndex !== null) {
      setStolenReviewIndex(targetReviewIndex)
      setTargetReviewIndex(null)
    }
  }

  return (
    <motion.section
      ref={ref}
      className="bg-foreground/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 mobile:p-6 relative overflow-hidden"
      initial={{ opacity: 0.3 }}
      animate={isInView ? { opacity: 0.95 } : { opacity: 0.3 }}
      transition={{ duration: 1 }}>
      {/* Background horror effects */}
      <div className="absolute top-4 right-4 opacity-3">
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <Image src="/ghost-3.png" alt="section ghost" width={40} height={40} className="w-10 h-10" />
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-3">
        <motion.div
          animate={{
            opacity: [0.03, 0.1, 0.03],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}>
          <Image src="/ghost-4-5.png" alt="section ghost" width={32} height={32} className="w-8 h-8" />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-1 h-8 bg-white/60 rounded-full shadow-sm shadow-white/10" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl mobile:text-2xl font-bold text-title opacity-90">What our clients write about us</h1>
        </div>
      </div>

      <ul className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
        {consts.reviews.map((review, index) => (
          <GoogleReview
            key={index}
            index={index}
            usrAvatarUrl={review.usrAvatarUrl}
            username={review.username}
            date={review.date}
            reviewMessage={review.reviewMessage}
            amountOfStarts={review.amountOfStars}
            isStolen={stolenReviewIndex === index}
            isTargetForStealing={targetReviewIndex === index}
            onSteal={handleSteal}
          />
        ))}
      </ul>

      {/* Subtle horror gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none rounded-xl" />
    </motion.section>
  )
}
