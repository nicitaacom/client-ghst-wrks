// app/components/AICarService.tsx
"use client"

import { useRef, useState } from "react"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"
import { motion, AnimatePresence } from "framer-motion"
import { FiMessageSquare, FiImage, FiAlertCircle, FiX, FiCalendar } from "react-icons/fi"
import { FaCar } from "react-icons/fa"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaRegCalendarAlt } from "react-icons/fa"

import { useAI } from "@/features/ai/store/useAI"
import { AISDK } from "@/features/ai/class/AISDK"
import CalendarContainer from "@/widgets/Calendar/CalendarContainer"
import { businessInfo } from "@/consts/businessInfo"
import Image from "next/image"

export function AICarService() {
  const {
    carModel,
    userNeeds,
    aiRecommendation,
    beforeImage,
    afterImage,
    loading,
    error,
    step,
    setCarModel,
    setUserNeeds,
    setAIRecommendation,
    setBeforeImage,
    setAfterImage,
    setLoading,
    setError,
    setStep,
    resetState,
    clearError,
  } = useAI()
  const [highlightNeeds, setHighlightNeeds] = useState(false)
  const [allowEditNeeds, setAllowEditNeeds] = useState(false)
  const [direction, setDirection] = useState(0)
  const [maxStep, setMaxStep] = useState(1)
  const userNeedsReference = useRef<HTMLTextAreaElement>(null)

  // 2. get recommendation
  const getAIRecommendation = async (): Promise<void> => {
    const modelError = AISDK.validateCarModel?.(carModel) ?? null
    const needsError = AISDK.validateUserNeeds?.(userNeeds) ?? null
    if (modelError) return void setError(modelError)
    if (needsError) return void setError(needsError)
    setLoading(true)
    clearError()

    const result = await AISDK.getRecommendation(carModel, userNeeds)
    if (typeof result === "string") return void (setError(result), setLoading(false))
    if (AISDK.isRecommendationResponse?.(result)) {
      setAIRecommendation(result.recommendation)
      if (result.recommendation.includes("Do you want to book based on my recommendations")) {
        setAllowEditNeeds(false)
        setHighlightNeeds(false)
      } else if (result.recommendation.includes("?")) {
        setAllowEditNeeds(true)
        userNeedsReference.current?.focus()
        setHighlightNeeds(true)
        setTimeout(() => {
          setHighlightNeeds(false)
          userNeedsReference.current?.focus()
        }, 2000)
      } else {
        setAllowEditNeeds(false)
        setHighlightNeeds(false)
      }
      setDirection(1)
      setStep(2)
      setMaxStep(Math.max(maxStep, 2))
      setLoading(false)
    } else {
      setError("Unexpected response from AI recommendation")
      setLoading(false)
    }
  }

  // 3. generate before/after images
  const generateImages = async (): Promise<void> => {
    setLoading(true)
    clearError()
    const result = await AISDK.generateImages(carModel, aiRecommendation)
    if (typeof result === "string") return void (setError(result), setLoading(false))
    if (AISDK.isImageGenerationResponse?.(result)) {
      setBeforeImage(result.beforeImageUrl)
      setAfterImage(result.afterImageUrl)
      setDirection(1)
      setStep(3)
      setMaxStep(Math.max(maxStep, 3))
    } else {
      console.log(96, "result - ", result)
      setError("Unexpected response format from image generation")
    }
    setLoading(false)
  }

  // book service
  const bookService = (): void => {
    setDirection(1)
    setStep(4)
    setMaxStep(Math.max(maxStep, 4))
  }

  // 4. animations & helpers
  const containerVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, staggerChildren: 0.06 } },
  }
  const itemVariants = { hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0, transition: { duration: 0.32 } } }
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.36 } },
  }
  const stepVariants = {
    hidden: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.3 } }),
  }
  const steps: { id: 1 | 2 | 3 | 4; label: string }[] = [
    { id: 1, label: "Vehicle" },
    { id: 2, label: "Recommendation" },
    { id: 3, label: "Preview" },
    { id: 4, label: "Schedule" },
  ]
  const goToStep = (target: 1 | 2 | 3 | 4) => {
    if (target > maxStep) return
    setDirection(target > step ? 1 : -1)
    setStep(target)
  }

  return (
    <motion.div
      className="flex flex-col gap-4 max-w-5xl mx-auto p-4 mobile:p-6 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      {/* Background ghost effects */}
      <div className="absolute top-4 right-4 opacity-5">
        <Image src="/ghost-1.png" alt="bg ghost" width={48} height={48} className="w-12 h-12 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-5">
        <Image src="/ghost-2.png" alt="bg ghost" width={40} height={40} className="w-10 h-10 animate-pulse" />
      </div>

      {/* Header */}
      <motion.div className="flex flex-col gap-2" variants={itemVariants}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaCar className="text-white/80 text-2xl" />
              <Image
                src="/ghost-3.png"
                alt="ghost"
                width={16}
                height={16}
                className="absolute -top-1 -right-1 w-4 h-4 opacity-30 animate-pulse"
              />
            </div>
            <div>
              <h2 className="text-2xl tablet:text-3xl font-bold text-title flex items-center gap-2">
                AI Car Detailing Service
                <Image
                  src="/ghost-6.png"
                  alt="ghost"
                  width={24}
                  height={24}
                  className="w-5 h-5 mobile:w-6 mobile:h-6 opacity-20 animate-pulse"
                />
              </h2>
              <p className="text-subTitle text-sm tablet:text-base opacity-80">
                AI suggests, you choose - preview before & after.
              </p>
            </div>
          </div>
          {/* Step Indicators */}
          <div className="hidden mobile:flex items-center gap-2">
            {steps.map(s => {
              const active = s.id === step
              const isDisabled = s.id > maxStep
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  aria-current={active}
                  onClick={() => goToStep(s.id)}
                  whileTap={{ scale: 0.94 }}
                  disabled={isDisabled}
                  className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none border border-white/20 relative ${active ? "bg-white/90 text-black shadow-lg shadow-white/20" : "bg-background/20 text-subTitle hover:bg-white/10"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <span className="text-sm font-semibold">{s.id}</span>
                  {active && (
                    <Image
                      src="/ghost-4-5.png"
                      alt="ghost"
                      width={12}
                      height={12}
                      className="absolute -top-1 -right-1 w-3 h-3 opacity-50"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
        {/* mobile step indicator with labels */}
        <div className="flex mobile:hidden items-center justify-between gap-2">
          {steps.map(s => {
            const active = s.id === step
            const isDisabled = s.id > maxStep
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => goToStep(s.id)}
                whileTap={{ scale: 0.94 }}
                disabled={isDisabled}
                className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-colors border border-white/20 relative ${active ? "bg-white/90 text-black" : "bg-background/20 text-subTitle"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                {s.label}
                {active && (
                  <Image
                    src="/ghost-1.png"
                    alt="ghost"
                    width={12}
                    height={12}
                    className="absolute -top-1 -right-1 w-3 h-3 opacity-50"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-danger/10 border border-danger/30 rounded-md p-2 flex items-start gap-2 backdrop-blur-sm relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}>
            <Image
              src="/ghost-2.png"
              alt="error ghost"
              width={16}
              height={16}
              className="absolute top-1 right-1 w-4 h-4 opacity-20"
            />
            <FiAlertCircle className="text-danger mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-danger text-sm">{error}</p>
            </div>
            <button type="button" className="p-0.5 rounded hover:bg-danger/10" onClick={clearError}>
              <FiX className="text-danger" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="bg-foreground/50 backdrop-blur-sm rounded-md p-4 border border-white/20 relative overflow-hidden"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="absolute top-3 right-3 opacity-10">
              <Image src="/ghost-3.png" alt="step ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <FaCar className="text-white/80 text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 1: Your Vehicle</h3>
              <Image
                src="/ghost-1.png"
                alt="ghost"
                width={20}
                height={20}
                className="w-5 h-5 opacity-20 animate-pulse"
              />
            </div>
            <div className="relative z-10">
              <label className="block text-subTitle mb-1 text-sm">Car Model *</label>
              <motion.input
                className="w-full bg-background/50 backdrop-blur-sm border border-white/20 rounded-md px-3 py-2 text-title focus:border-white/50 focus:outline-none transition-colors placeholder:text-subTitle/70"
                placeholder="e.g., Tesla Model 3, BMW X5"
                value={carModel}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCarModel(event.target.value)}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.14 }}
              />
            </div>
            <div className="mt-3 relative z-10">
              <label className="flex items-center gap-2 text-subTitle mb-1 text-sm">
                What do you want? *
                <Image
                  src="/ghost-6.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="w-4 h-4 opacity-20 animate-pulse"
                />
              </label>
              <motion.textarea
                ref={userNeedsReference}
                className={`w-full bg-background/50 backdrop-blur-sm border border-white/20 rounded-md px-3 py-2 text-title focus:border-white/50 focus:outline-none h-20 resize-none transition-colors placeholder:text-subTitle/70 ${
                  highlightNeeds ? "border-white/70 shadow-white/20" : ""
                }`}
                placeholder="Describe - paint correction, ceramic coating, interior deep clean, etc."
                value={userNeeds}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setUserNeeds(event.target.value)}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.14 }}
              />
            </div>
            <motion.button
              className={`mt-3 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 relative group overflow-hidden ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
              onClick={getAIRecommendation}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-black" />
              ) : (
                <FiMessageSquare className="text-black" />
              )}
              <span>Get AI Recommendation</span>
              <Image
                src="/ghost-4-5.png"
                alt="ghost"
                width={16}
                height={16}
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            className="bg-foreground/50 backdrop-blur-sm rounded-md p-4 border border-white/20 relative overflow-hidden"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="absolute top-3 right-3 opacity-10">
              <Image src="/ghost-2.png" alt="step ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <FiMessageSquare className="text-white/80 text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 2: AI Recommendation</h3>
              <Image
                src="/ghost-3.png"
                alt="ghost"
                width={20}
                height={20}
                className="w-5 h-5 opacity-20 animate-pulse"
              />
            </div>
            <motion.div
              className="bg-background/50 backdrop-blur-sm rounded-md p-3 border border-white/20 text-base tablet:text-lg leading-relaxed relative z-10"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              dangerouslySetInnerHTML={{
                __html: aiRecommendation || `<p><strong>No recommendation</strong></p><p><em>Generate one.</em></p>`,
              }}
            />
            {allowEditNeeds && (
              <div className="mt-3 relative z-10">
                <label className="flex items-center gap-2 text-subTitle mb-1 text-sm">
                  Update your needs *
                  <Image
                    src="/ghost-1.png"
                    alt="ghost"
                    width={16}
                    height={16}
                    className="w-4 h-4 opacity-20 animate-pulse"
                  />
                </label>
                <motion.textarea
                  ref={userNeedsReference}
                  className={`w-full bg-background/50 backdrop-blur-sm border border-white/20 rounded-md px-3 py-2 text-title focus:border-white/50 focus:outline-none h-20 resize-none transition-colors placeholder:text-subTitle/70 ${
                    highlightNeeds ? "border-white/70 shadow-white/20" : ""
                  }`}
                  placeholder="Describe - paint correction, ceramic coating, interior deep clean, etc."
                  value={userNeeds}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setUserNeeds(event.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.14 }}
                />
              </div>
            )}
            <div className="flex flex-col mobile:flex-row gap-2 mt-3 relative z-10">
              {allowEditNeeds ? (
                <motion.button
                  className={`bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 relative group overflow-hidden
                     ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                  onClick={getAIRecommendation}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-black" />
                  ) : (
                    <FiMessageSquare className="text-black" />
                  )}
                  <span>Update Recommendation</span>
                  <Image
                    src="/ghost-6.png"
                    alt="ghost"
                    width={16}
                    height={16}
                    className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </motion.button>
              ) : null}
              <motion.button
                className={`bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 relative group overflow-hidden
                   ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={generateImages}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-black" />
                ) : (
                  <FiImage className="text-black" />
                )}
                <span>Generate Preview Images</span>
                <Image
                  src="/ghost-4-5.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
              <motion.button
                className={`bg-white/90 hover:bg-white text-black flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition-colors relative group overflow-hidden ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={bookService}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <FaRegCalendarAlt />
                <span>Book Appointment</span>
                <Image
                  src="/ghost-3.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
              <motion.button
                className={`bg-foreground-accent/50 backdrop-blur-sm hover:bg-white/10 text-title px-4 py-2 rounded-md font-medium transition-colors border border-white/20 relative group ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={() => goToStep(1)}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <span>Modify Request</span>
                <Image
                  src="/ghost-1.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="absolute top-1 right-1 w-4 h-4 opacity-0 group-hover:opacity-20 transition-opacity"
                />
              </motion.button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            className="flex flex-col bg-foreground/50 backdrop-blur-sm rounded-md p-4 border border-white/20 relative overflow-hidden "
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="absolute top-3 right-3 opacity-10">
              <Image src="/ghost-6.png" alt="step ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <FiImage className="text-white/80 text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 3: Service Preview</h3>
              <Image
                src="/ghost-2.png"
                alt="ghost"
                width={20}
                height={20}
                className="w-5 h-5 opacity-20 animate-pulse"
              />
            </div>
            <motion.div variants={itemVariants} className="relative z-10 flex flex-col flex-1">
              <h4 className="text-base tablet:text-lg font-medium text-title mb-1 flex items-center gap-2">
                Before / After
                <Image
                  src="/ghost-4-5.png"
                  alt="ghost"
                  width={18}
                  height={18}
                  className="w-4 h-4 mobile:w-5 mobile:h-5 opacity-30 animate-pulse"
                />
              </h4>
              <motion.div
                className="bg-background/50 backdrop-blur-sm rounded-md overflow-hidden border border-white/20 relative flex-1"
                variants={imageVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.26 }}>
                {beforeImage && afterImage ? (
                  <ReactCompareSlider
                    className="h-[50vh]"
                    itemOne={
                      <ReactCompareSliderImage
                        className="h-[50vh] object-contain object-center"
                        src={beforeImage}
                        alt="Before detailing service"
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        className="h-[50vh] object-contain object-center"
                        src={afterImage}
                        alt="After detailing service"
                      />
                    }
                  />
                ) : (
                  <div className="text-subTitle flex items-center justify-center h-full gap-2">
                    <span>No preview available</span>
                    <Image
                      src="/ghost-1.png"
                      alt="ghost"
                      width={20}
                      height={20}
                      className="w-5 h-5 opacity-30 animate-pulse"
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
            <div className="flex flex-col mobile:flex-row gap-2 mt-3 relative z-10">
              <motion.button
                className={`bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md font-medium transition-colors relative group overflow-hidden ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={bookService}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <span>Book This Service</span>
                <Image
                  src="/ghost-3.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="absolute top-1 right-1 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
              <motion.button
                className={`bg-foreground-accent/50 backdrop-blur-sm hover:bg-white/10 text-title px-4 py-2 rounded-md font-medium transition-colors border border-white/20 relative group ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={() => (resetState(), setMaxStep(1))}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <span>Start Over</span>
                <Image
                  src="/ghost-6.png"
                  alt="ghost"
                  width={16}
                  height={16}
                  className="absolute top-1 right-1 w-4 h-4 opacity-0 group-hover:opacity-20 transition-opacity"
                />
              </motion.button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div
            key="step4"
            className="bg-foreground/50 backdrop-blur-sm rounded-md p-4 border border-white/20 relative overflow-hidden"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="absolute top-3 right-3 opacity-10">
              <Image src="/ghost-1.png" alt="step ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <FiCalendar className="text-white/80 text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 4: Schedule Appointment</h3>
              <Image
                src="/ghost-4-5.png"
                alt="ghost"
                width={20}
                height={20}
                className="w-5 h-5 opacity-20 animate-pulse"
              />
            </div>
            <div className="relative z-10">
              <CalendarContainer
                businessHours={businessInfo.businessHours}
                maxBookingDaysInAdvance={28}
                defaultTimezone={businessInfo.timezone}
                phonePlaceholder="e.g +44 123 456 78 90"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
