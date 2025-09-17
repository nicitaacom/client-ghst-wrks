// 1. UI constants that reference businessInfo to avoid duplication
import { businessInfo } from "./businessInfo"

export const consts = {
  // 1. small derived values for UI (no duplicates — derive from businessInfo)
  yoe: businessInfo.yearsInBusiness,
  yog: businessInfo.yearsOfGuarantee,
  notificationBarOffer: `Satisfaction guarantee — ${businessInfo.yearsOfGuarantee} year${businessInfo.yearsOfGuarantee > 1 ? "s" : ""}`,

  // 2. map + socials (re-using references is OK)
  mapUrl: businessInfo.mapUrl,
  social: { facebook: businessInfo.facebookUrl, instagram: businessInfo.instagramUrl },

  // 3. Services (images + labels) for listing cards / grid
  ourServices: [
    { imgUrl: "/services/img-1.jpg", serviceName: "The Full Wrks" },
    { imgUrl: "/services/img-2.jpg", serviceName: "Stage 1 Polish" },
    { imgUrl: "/services/img-3.jpg", serviceName: "Stage 2 Polish" },
    { imgUrl: "/services/img-4.jpg", serviceName: "12M Ceramic Coating" },
    { imgUrl: "/services/img-5.jpg", serviceName: "24M Ceramic Coating" },
    { imgUrl: "/services/img-6.jpg", serviceName: "Interior only" },
  ],

  // 4. Reviews (UI-ready)
  reviews: [
    {
      usrAvatarUrl: "/reviews/user-1.png",
      username: "Mohammed Hossain",
      date: "12.08.2025",
      reviewMessage:
        "Absolutely Outstanding Car Detailing! I recently had my car detailed by GHST WRKS and couldn’t be more impressed. Every inch of the vehicle—inside and out—was spotless. The attention to detail was exceptional, from the polished exterior to the deeply cleaned interior, including carpets and dashboard. I highly recommend GHST WRKS to anyone looking to give their car a real refresh!",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/user-2.png",
      username: "Monaco Motor Group",
      date: "23.06.2025",
      reviewMessage: `I just had my car detailed by GHST WRKS and I couldn’t be happier with the results. The team was professional, thorough, and took real pride in their work. My car looks and smells like it just came off the showroom floor 👌

Every little spot, crevice, and surface was cleaned to perfection. They were also on time, friendly, and explained everything they did. It’s rare to find this level of care and attention these days.

Highly recommend to anyone who wants their car to truly shine!

Will I use Ghst Wrks again?… YESS!!🙌`,
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/user-3.png",
      username: "noorie b",
      date: "19.05.2025",
      reviewMessage:
        "GHST WRKS did an amazing job on my car. 10/10 100% would recommend to everyone. Came out glistening.",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/user-4.png",
      username: "Ibrahim Ahmed",
      date: "17.05.2025",
      reviewMessage:
        "Quality service, amazing attention to detail. Easy booking process and quick turnaround. They look after you as a customer and offer fantastic service. 100% recommended.",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/user-5.png",
      username: "M W",
      date: "15.05.2025",
      reviewMessage:
        "Can’t say enough good things about GHSTWRKS. They detailed my car and it came out looking insane, better than brand new. I legit couldn’t stop smiling when I saw it. Super friendly, easy to deal with, and you can tell they actually care about what they do. Just a solid experience all around. If you’re thinking about getting your car detailed or any kind of work done, don’t bother looking anywhere else. These guys are it..",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/user-6.png",
      username: "Majid Hussain",
      date: "15.06.2025",
      reviewMessage:
        "Absolutely outstanding service! My car looks like it’s just come out of the showroom - spotless inside and out. The team went above and beyond, taking care of little extras without me even asking, including fixing my sun visor and fitting new number plates. You can really see the pride they take in their work. Friendly, professional, and top-quality results – highly recommend to anyone looking for proper car detailing!",
      amountOfStars: 5,
    },
  ],

  // 5. How-we-work tabs (flow steps used on services pages)
  howWeWorkTabs: [
    {
      text: "Full Detail",
      iconSrc: "/how-do-we-work/tabs/magic.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/check.png",
          title: "Initial Check",
          description: "We inspect your vehicle and note down areas needing special attention.",
        },
        {
          iconSrc: "/how-do-we-work/exterior-wash.png",
          title: "Exterior Wash",
          description: "Thorough safe wash, including wheels and arches.",
        },
        {
          iconSrc: "/how-do-we-work/interior-detail.png",
          title: "Interior Clean",
          description: "Deep clean carpets, seats, plastics and vents.",
        },
        {
          iconSrc: "/how-do-we-work/polish-icon.png",
          title: "Polish & Finish",
          description: "Polish paintwork and dress trims for a showroom finish.",
        },
        {
          iconSrc: "/how-do-we-work/100.png",
          title: "Final Walkthrough",
          description: "We review the detail with you to ensure you’re 100% satisfied.",
        },
      ],
    },
    {
      text: "Ceramic Coating",
      iconSrc: "/how-do-we-work/tabs/ceramic-coating-icon.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/decontamination.png",
          title: "Decontamination",
          description: "Full decontamination wash including clay bar treatment.",
        },
        {
          iconSrc: "/how-do-we-work/paint-correction.png",
          title: "Paint Correction",
          description: "Single or multi-stage machine polish to remove swirls & defects.",
        },
        {
          iconSrc: "/how-do-we-work/shield.png",
          title: "Apply Ceramic",
          description: "Layer ceramic coating for deep gloss & hydrophobic protection.",
        },
        {
          iconSrc: "/how-do-we-work/time.png",
          title: "Curing Time",
          description: "Allow coating to bond and cure properly for long-lasting results.",
        },
        {
          iconSrc: "/how-do-we-work/finish.png",
          title: "Inspection",
          description: "Check every panel for flawless finish.",
        },
      ],
    },
    {
      text: "Interior Detail",
      iconSrc: "/how-do-we-work/tabs/interior-detail.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/vacuum.png",
          title: "Vacuum",
          description: "Thorough vacuum for carpets, mats, and seats — every crumb gone.",
        },
        {
          iconSrc: "/how-do-we-work/shampoo.png",
          title: "Shampoo & Extraction",
          description: "Stubborn stains and odours lifted with deep shampoo & hot-water extraction.",
        },
        {
          iconSrc: "/how-do-we-work/streeing-wheel.png",
          title: "Leather Care",
          description: "Leather seats and trims cleansed, conditioned, and revived.",
        },
        {
          iconSrc: "/how-do-we-work/vents.png",
          title: "Detailing",
          description: "Dashboard, vents, and hidden crevices cleaned with precision.",
        },
        {
          iconSrc: "/how-do-we-work/perfection.png",
          title: "Final Touches",
          description: "Air freshener and presentation check for absolute perfection.",
        },
      ],
    },
  ],
}
