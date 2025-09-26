"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { consts } from "@/consts/consts"

interface HoverGhost {
  x: number
  y: number
  show: boolean
  blinking: boolean
  ghostImage: string
}

interface ClickGhost {
  show: boolean
  stepIndex: number
}

function Tab({
  selectedTab,
  buttonText,
  iconSrc,
  onClick,
  onHover,
}: {
  selectedTab: string
  buttonText: string
  iconSrc: string
  onClick: (tab: string) => void
  onHover: (event: React.MouseEvent) => void
}) {
  const isSelected = selectedTab === buttonText

  return (
    <button
      onClick={() => onClick(buttonText)}
      onMouseEnter={onHover}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm uppercase transition-all duration-200 border relative overflow-hidden ${
        isSelected
          ? "bg-white/90 text-black border-white shadow-lg shadow-white/20"
          : "bg-foreground-accent/50 backdrop-blur-sm text-subTitle border-white/20 hover:border-white/50 hover:text-title hover:bg-white/5"
      }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10">{buttonText}</span>
      <Image
        className={`w-4 h-4 transition-all relative z-10 ${isSelected ? "filter brightness-0" : "opacity-70"}`}
        src={iconSrc}
        alt="icon"
        width={16}
        height={16}
      />
    </button>
  )
}

export function HowDoWeWork() {
  const [selectedTab, setSelectedTab] = useState<string>(consts.howWeWorkTabs[0]?.text || "")
  const [hoverGhost, setHoverGhost] = useState<HoverGhost>({
    x: 0,
    y: 0,
    show: false,
    blinking: false,
    ghostImage: "/ghost-1.png",
  })
  const [clickGhost, setClickGhost] = useState<ClickGhost>({
    show: false,
    stepIndex: -1,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const ghostImages = ["/ghost-1.png", "/ghost-2.png", "/ghost-3.png", "/ghost-6.png", "/ghost-4-5.png"]

  const handleTabClick = (tab: string) => setSelectedTab(tab)
  const selectedTabContent = consts.howWeWorkTabs.find(tab => tab.text === selectedTab)

  const handleHover = (event: React.MouseEvent) => {
    // Random chance for ghost to appear on hover (15%)
    if (Math.random() < 0.15) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const randomGhost = ghostImages[Math.floor(Math.random() * ghostImages.length)]

        setHoverGhost({
          x: event.clientX - rect.left + (Math.random() - 0.5) * 100,
          y: event.clientY - rect.top + (Math.random() - 0.5) * 100,
          show: true,
          blinking: false,
          ghostImage: randomGhost,
        })

        // Start blinking after 500ms
        setTimeout(() => {
          setHoverGhost(prev => ({ ...prev, blinking: true }))

          // Blink pattern: appear/disappear rapidly
          let blinkCount = 0
          const maxBlinks = Math.floor(Math.random() * 6) + 3 // 3-8 blinks

          const blinkInterval = setInterval(() => {
            setHoverGhost(prev => ({
              ...prev,
              show: prev.show ? false : true,
            }))
            blinkCount++

            if (blinkCount >= maxBlinks) {
              clearInterval(blinkInterval)
              setHoverGhost(prev => ({ ...prev, show: false, blinking: false }))
            }
          }, 150)
        }, 500)
      }
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Random chance for big ghost to appear on click (20%)
    if (Math.random() < 0.2) {
      setClickGhost({
        show: true,
        stepIndex,
      })

      // Hide after 2 seconds
      setTimeout(() => {
        setClickGhost({ show: false, stepIndex: -1 })
      }, 2000)
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-foreground/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 mobile:p-6 relative overflow-hidden">
      {/* Background horror effects */}
      <div className="absolute top-4 right-4 opacity-3">
        <motion.div
          animate={{
            opacity: [0.03, 0.1, 0.03],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <Image src="/ghost-3.png" alt="bg ghost" width={40} height={40} className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Hover Ghost */}
      <AnimatePresence>
        {hoverGhost.show && (
          <motion.div
            className="absolute z-30 pointer-events-none"
            style={{
              left: hoverGhost.x,
              top: hoverGhost.y,
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: hoverGhost.blinking ? [0.8, 1.2, 0.8] : 1,
              opacity: hoverGhost.blinking ? [0.3, 1, 0.3] : 0.8,
              rotate: hoverGhost.blinking ? [0, 10, -10, 0] : 0,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: hoverGhost.blinking ? 0.1 : 0.3,
              repeat: hoverGhost.blinking ? Infinity : 0,
            }}>
            <Image
              src={hoverGhost.ghostImage}
              alt="hover ghost"
              width={48}
              height={48}
              className="w-12 h-12 filter drop-shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Ghost - Big Ghost */}
      <AnimatePresence>
        {clickGhost.show && (
          <motion.div
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <motion.div
              initial={{
                scale: 0,
                rotate: -180,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.3, 1],
                rotate: [0, 360, 270],
                opacity: [0, 0.9, 0.7],
              }}
              exit={{
                scale: 0,
                rotate: 180,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                times: [0, 0.6, 1],
              }}>
              <Image
                src="/ghost-2.png"
                alt="big click ghost"
                width={200}
                height={200}
                className="w-48 h-48 filter drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: [-200, 200],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: 2,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-1 h-8 bg-white/80 rounded-full shadow-sm shadow-white/20" />
        <div className="flex items-center gap-2">
          <h3 className="text-xl mobile:text-2xl text-title">
            How do we <span className="font-bold">work?</span>
          </h3>
          <Image
            src="/ghost-6.png"
            alt="ghost"
            width={24}
            height={24}
            className="w-5 h-5 mobile:w-6 mobile:h-6 opacity-20 animate-pulse"
          />
        </div>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap gap-3 mb-6 relative z-10">
        {consts.howWeWorkTabs.map(tab => (
          <li key={`tab-${tab.text}`}>
            <Tab
              selectedTab={selectedTab}
              buttonText={tab.text}
              iconSrc={tab.iconSrc}
              onClick={handleTabClick}
              onHover={handleHover}
            />
          </li>
        ))}
      </ul>

      {/* Steps */}
      {selectedTabContent && (
        <div className="grid gap-4 laptop:grid-cols-2 desktop:grid-cols-3 relative z-10">
          {selectedTabContent.steps.map((step, index) => (
            <motion.div
              key={`step-${index}`}
              className="bg-foreground-accent/50 backdrop-blur-sm hover:bg-white/5 rounded-xl p-4 duration-200
              border border-white/10 hover:border-white/30 cursor-pointer relative overflow-hidden group"
              onClick={() => handleStepClick(index)}
              onMouseEnter={handleHover}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                  {step.iconSrc && step.iconSrc !== "/" ? (
                    <Image
                      className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                      src={step.iconSrc}
                      alt={step.title}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <span className="text-white font-bold text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                      {index + 1}
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-title opacity-90 group-hover:opacity-100 transition-opacity">
                  {step.title}
                </h5>

                {/* Small ghost that appears on hover */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-30 transition-opacity">
                  <Image
                    src="/ghost-4-5.png"
                    alt="step ghost"
                    width={16}
                    height={16}
                    className="w-4 h-4 animate-pulse"
                  />
                </div>
              </div>

              <p className="text-sm text-subTitle leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity relative z-10">
                {step.description}
              </p>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Overall horror gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none rounded-xl" />
    </div>
  )
}
