import { HomeIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

export const APP_CONFIG = {
  name: "Prepilo - AI-Powered Interview Prep Tool",
  description: "Prepilo uses AI to help you ace interviews. Prepare smarter, land your dream job.",
  title: "Interview Prep Platform",
  logo: {
    text: "P",
    gradient: "from-primary to-primary/80",
  },
  navigation: {
    main: [
      { label: "Dashboard", href: "/app", icon: HomeIcon },
      { label: "Interviews", href: "/app/interviews", icon: VideoCameraIcon },
    ],
  },
  social: {
    github: "https://github.com/prepilo",
    twitter: "https://twitter.com/prepilo",
  },
  contact: {
    email: "support@prepilo.com",
  },
  og: {
    title: "Prepilo - AI-Powered Job Preparation",
    description: "Master interviews with Prepilo AI tool.",
    url: "https://prepilo.com",
    siteName: "Prepilo",
    type: "website",
  },
} as const; 