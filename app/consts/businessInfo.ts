// 1. Core business data used across the app (contact, hours, location, rating)
export const businessInfo = {
  name: "Ghst Wrks",
  yearsInBusiness: 3, // numeric for easy usage in UI
  yearsOfGuarantee: 3, // satisfaction guarantee in years
  phone: "+44 208 226 60 79",
  timezone: "Europe/London",
  email: "support@ghstwrks.co.uk",
  websiteUrl: "support@ghstwrks.co.uk",
  yellPagesUrl: "",
  logoUrl: "",
  cta: "get free quote",

  // 2. Location / map
  address: {
    street: "Unit 22a, Rippleside Commercial Estate",
    city: "Barking",
    county: "Greater London",
    postalCode: "IG11 0RJ",
    country: "United Kingdom",
  },
  coordinates: {
    latitude: 51.531027,
    longitude: 0.122846,
  },
  mapUrl:
    "https://www.google.com/maps/place/GHST+WRKS/@51.5187899,0.0054014,10.86z/data=!4m14!1m7!3m6!1s0x47d8a55a3e3ceb8f:0x4d5b4fdeecb5d344!2sGHST+WRKS!8m2!3d51.5311378!4d0.120112!16s%2Fg%2F11xfbxzs7f!3m5!1s0x47d8a55a3e3ceb8f:0x4d5b4fdeecb5d344!8m2!3d51.5311378!4d0.120112!16s%2Fg%2F11xfbxzs7f?entry=ttu&g_ep=EgoyMDI1MDkxNC4wIKXMDSoASAFQAw%3D%3D",

  // 3. Hours & service area
  businessHours: {
    monday: { opens: "10:00", closes: "18:00" },
    tuesday: { opens: "10:00", closes: "18:00" },
    wednesday: { opens: "10:00", closes: "18:00" },
    thursday: { opens: "10:00", closes: "18:00" },
    friday: { opens: "14:30", closes: "21:30" },
    saturday: { opens: "10:00", closes: "18:00" },
    // TODO - update so it's closed on sunday
    sunday: { opens: "00:00", closes: "00:00" },
  },
  areasServed: [
    "London",
    "Barking and Dagenham",
    "Barnet",
    "Bexley",
    "Brent",
    "Bromley",
    "Camden",
    "Croydon",
    "Ealing",
    "Enfield",
    "Greenwich",
    "Hackney",
    "Hammersmith and Fulham",
    "Haringey",
    "Harrow",
    "Havering",
    "Hillingdon",
    "Hounslow",
    "Islington",
    "Kensington and Chelsea",
    "Kingston upon Thames",
    "Lambeth",
    "Lewisham",
    "Merton",
    "Newham",
    "Redbridge",
    "Richmond upon Thames",
    "Southwark",
    "Sutton",
    "Tower Hamlets",
    "Waltham Forest",
    "Wandsworth",
    "Westminster",
  ],

  // 4. High-level services (used for meta / schema)
  primaryServices: [
    {
      name: "The Full Wrks",
      includes: [
        "Exterior wash",
        "Wax",
        "Wheel & tyre clean",
        "Vacuum (seats, carpets, trunk)",
        "Dashboard & console clean",
        "Glass inside & outside",
        "Engine bay steam clean",
        "Interior & exterior detail",
      ],
    },
    {
      name: "Stage 1 Polish",
      includes: ["Exterior wash", "Clay bar", "Single-stage machine polish", "Gloss enhancement", "Sealant"],
    },
    {
      name: "Stage 2 Polish",
      includes: [
        "Exterior wash",
        "Clay bar",
        "Two-stage machine polish",
        "Swirl & defect removal",
        "Gloss enhancement",
        "Sealant",
      ],
    },
    {
      name: "12M Ceramic Coating",
      includes: ["Exterior wash", "Clay bar", "Machine polish prep", "12-month ceramic coating"],
    },
    {
      name: "24M Ceramic Coating",
      includes: ["Exterior wash", "Clay bar", "Machine polish prep", "24-month ceramic coating"],
    },
    {
      name: "Interior Only",
      includes: [
        "Vacuum (seats, carpets, trunk)",
        "Carpet & upholstery shampoo",
        "Leather conditioning",
        "Dashboard & console clean",
        "Trim & buttons detail",
        "Glass inside",
      ],
    },
  ],

  // 5. socials & business meta
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/",
  foundingYear: 2024,
  founders: ["Kairo"],
  priceRange: "££",
  guarantee: "Satisfaction Guarantee - If you’re not 100% satisfied, I’ll make it right before you leave.",

  // 6. Rating info (numbers, ready for structured data)
  rating: {
    average: 5,
    count: 25,
    googleMaps: 5,
    yelp: 5,
    max: 5,
  },
}
