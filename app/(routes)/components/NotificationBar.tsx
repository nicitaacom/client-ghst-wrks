import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { consts } from "@/consts/consts"

interface ItemProps {
  className?: string
  iconSrc: string
  altText: string
  text: string
  ghostImage?: string
}

function Item({ className, iconSrc, altText, text, ghostImage }: ItemProps) {
  return (
    <div className={twMerge("flex justify-center items-center gap-x-2 relative group", className)}>
      {ghostImage && (
        <Image
          className="absolute -top-2 -left-1 w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"
          src={ghostImage}
          alt="ghost"
          width={24}
          height={24}
        />
      )}
      <Image
        className="w-4 h-4 filter brightness-0 invert opacity-70"
        src={iconSrc}
        alt={altText}
        width={16}
        height={16}
      />
      <p className="text-white text-sm font-medium opacity-90">{text}</p>
    </div>
  )
}

export function NotificationBar() {
  return (
    <section className="h-12 bg-gradient-to-r from-black via-gray-900 to-black flex justify-around items-center shadow-xl border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

      <Item
        iconSrc="/notification-bar/time.svg"
        altText="exp"
        text={`${consts.yoe} years experience`}
        ghostImage="/ghost-1.png"
      />
      <Item
        className="hidden tablet:flex"
        iconSrc="/notification-bar/guarantee.svg"
        altText="grnt"
        text={`${consts.yog} years guarantee`}
        ghostImage="/ghost-2.png"
      />
      <Item
        className="hidden laptop:flex"
        iconSrc="/notification-bar/price-down.svg"
        altText="prc"
        text="Best market price"
        ghostImage="/ghost-3.png"
      />
      <Item
        className="hidden laptop:flex"
        iconSrc="/notification-bar/free.svg"
        altText="free"
        text={consts.notificationBarOffer}
        ghostImage="/ghost-6.png"
      />

      <div className="absolute top-1 right-4 opacity-10">
        <Image className="w-8 h-8 animate-bounce" src="/ghost-4-5.png" alt="floating ghost" width={32} height={32} />
      </div>
    </section>
  )
}
