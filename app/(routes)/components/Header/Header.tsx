import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { GoogleReviews } from "./GoogleReviews"
import { consts } from "@/consts/consts"
import { businessInfo } from "@/consts/businessInfo"
import { formatPhoneNumber } from "@/(routes)/utils/formatPhoneNumber"
import Link from "next/link"

interface SocialItemProps {
  className?: string
  iconSrc: string
  altText: string
  text: string
  href: string
}

function SocialItem({ className, iconSrc, altText, text, href }: SocialItemProps) {
  return (
    <Link
      className={twMerge(
        "flex flex-col items-center gap-1 hover:text-brand transition-all duration-300 group hover:scale-105",
        className,
      )}
      href={href}
      target="_blank">
      <Image
        className="w-4 h-4 group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100"
        src={iconSrc}
        alt={altText}
        width={16}
        height={16}
      />
      <p className="text-xs text-subTitle group-hover:text-brand transition-colors">{text}</p>
    </Link>
  )
}

export function Header() {
  return (
    <header className="bg-black border-b border-white/20 flex flex-col desktop:flex-row justify-around items-center py-4 px-4 mobile:px-6 tablet:px-8 laptop:px-12 desktop:px-16 relative overflow-hidden">
      <div className="absolute top-2 left-10 opacity-5">
        <Image className="w-12 h-12 animate-pulse" src="/ghost-1.png" alt="bg ghost" width={48} height={48} />
      </div>
      <div className="absolute bottom-2 right-10 opacity-5">
        <Image className="w-10 h-10 animate-pulse" src="/ghost-2.png" alt="bg ghost" width={40} height={40} />
      </div>

      <div className="w-[240px] hidden desktop:flex justify-center items-center gap-x-3 relative">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 relative group">
          <Image
            className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
            src="/ghost-3.png"
            alt="ghost logo"
            width={24}
            height={24}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white tracking-wider">GHST WRKS</h1>
          <p className="text-xs text-gray-400 opacity-60">We are transparent with you as ghosts</p>
        </div>
      </div>

      <div className="w-full flex flex-col laptop:flex-row justify-around gap-y-4">
        <div className="flex justify-center">
          <GoogleReviews />
        </div>

        <div className="flex flex-col gap-y-3 laptop:gap-y-0 gap-x-6 desktop:flex-row border-b border-white/10 laptop:border-none pb-3 laptop:pb-0">
          <div className="flex justify-center items-center gap-x-3 group">
            <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <Image
                className="w-3 h-3 filter brightness-0 invert opacity-70"
                src="/email.svg"
                alt="email"
                width={12}
                height={12}
              />
            </div>
            <p className="text-sm text-white opacity-90 group-hover:opacity-100 transition-opacity">
              {businessInfo.email}
            </p>
            <Image
              className="w-4 h-4 opacity-20 group-hover:opacity-40 transition-opacity"
              src="/ghost-4-5.png"
              alt="ghost"
              width={16}
              height={16}
            />
          </div>

          <div className="flex justify-center items-center gap-x-3 group">
            <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <Image
                className="w-3 h-3 filter brightness-0 invert opacity-70"
                src="/phone.svg"
                alt="phone"
                width={12}
                height={12}
              />
            </div>
            <p className="text-sm text-white opacity-90 font-medium group-hover:opacity-100 transition-opacity">
              {formatPhoneNumber(businessInfo.phone)}
            </p>
            <Image
              className="w-4 h-4 opacity-20 group-hover:opacity-40 transition-opacity"
              src="/ghost-6.png"
              alt="ghost"
              width={16}
              height={16}
            />
          </div>
        </div>

        <div className="flex flex-row justify-around items-center gap-x-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-5">
            <Image className="w-16 h-16 animate-pulse" src="/ghost-1.png" alt="social ghost" width={64} height={64} />
          </div>

          <SocialItem
            iconSrc="/social-icons/instagram.png"
            altText="instagram"
            text="our work"
            href={businessInfo.instagramUrl}
          />
          <SocialItem
            className="hidden tablet:flex"
            iconSrc="/social-icons/facebook.png"
            altText="facebook"
            text="our blog"
            href={businessInfo.facebookUrl}
          />
          <SocialItem
            className="hidden tablet:flex"
            iconSrc="/social-icons/yell-pages.png"
            altText="yell-pages"
            text="our reviews"
            href={businessInfo.yellPagesUrl}
          />
          <SocialItem
            iconSrc="/social-icons/whatsapp.png"
            altText="whatsapp"
            text="2min response"
            href={`https://wa.me/${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
          />
        </div>
      </div>

      <div className="desktop:hidden flex items-center gap-x-2 mt-2">
        <Image className="w-6 h-6 opacity-70" src="/ghost-3.png" alt="ghost" width={24} height={24} />
        <h1 className="text-lg font-bold text-white tracking-wider">GHST WRKS</h1>
      </div>
    </header>
  )
}
