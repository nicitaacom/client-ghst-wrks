import { consts } from "@/consts/consts"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface SocialItemProps {
  className?: string
  imgSrc: string
  altText: string
  text: string
}

function OurService({ className, imgSrc, altText, text }: SocialItemProps) {
  const ghostImages = ["/ghost-1.png", "/ghost-2.png", "/ghost-3.png", "/ghost-6.png"]
  const randomGhost = ghostImages[Math.floor(Math.random() * ghostImages.length)]

  return (
    <li
      className={twMerge(
        "group bg-foreground-accent/50 backdrop-blur-sm hover:bg-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-white/10 hover:border-white/30 relative",
        className,
      )}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity">
        <Image src={randomGhost} alt="ghost" width={20} height={20} className="w-5 h-5 animate-pulse" />
      </div>
      <div className="relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={altText}
          width={720}
          height={480}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3 relative">
        <p className="text-title text-sm font-semibold uppercase tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
          {text}
        </p>
      </div>
    </li>
  )
}

export function HowWeCanHelpYou() {
  return (
    <div className="w-full desktop:max-w-[50vw] bg-foreground/50 backdrop-blur-sm rounded-xl border border-white/20 flex flex-col gap-y-6 p-4 mobile:p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 opacity-5">
        <Image src="/ghost-4-5.png" alt="background ghost" width={48} height={40} className="w-12 h-10 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-5">
        <Image src="/ghost-1.png" alt="background ghost" width={32} height={32} className="w-8 h-8 animate-pulse" />
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-1 h-8 bg-white/80 rounded-full shadow-sm shadow-white/20" />
        <div className="flex items-center gap-2">
          <h2 className="text-xl mobile:text-2xl font-bold text-title">How we can help you?</h2>
          <Image
            src="/ghost-3.png"
            alt="ghost"
            width={24}
            height={24}
            className="w-5 h-5 mobile:w-6 mobile:h-6 opacity-30 animate-pulse"
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 mobile:grid-cols-2 laptop:grid-cols-3 gap-3 mobile:gap-4 relative z-10">
        {consts.ourServices.map(service => (
          <OurService
            key={service.serviceName}
            imgSrc={service.imgUrl}
            altText={service.serviceName}
            text={service.serviceName}
          />
        ))}
      </ul>

      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  )
}
