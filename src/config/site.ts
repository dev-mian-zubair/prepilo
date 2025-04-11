export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Prepilo - AI-Powered Interview Prep Tool",
  description:
    "Prepilo uses AI to help you ace interviews. Prepare smarter, land your dream job.",
  og: {
    title: "Prepilo - AI-Powered Job Preparation",
    description: "Master interviews with Prepilo AI tool.",
    url: "https://prepilo.com",
    siteName: "Prepilo",
    type: "website",
  },
  navItems: [
    {
      label: "Interviews",
      href: "/interviews",
    },
    {
      label: "Guides",
      href: "/guides",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Interviews",
      href: "/my-interviews",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
