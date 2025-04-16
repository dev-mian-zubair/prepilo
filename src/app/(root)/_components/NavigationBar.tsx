import { useState } from "react";
import { Link } from "@heroui/link";
import { ChartPie, Video, Settings } from "lucide-react";

const NavigationBar = () => {
  const [activeLink, setActiveLink] = useState<string>("/dashboard");

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: ChartPie,
    },
    {
      name: "Interviews",
      href: "/interviews",
      icon: Video,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex items-center justify-between p-6 bg-content1 border-b border-border rounded-t-xl">
      <nav className="flex space-x-8">
        {links.map((link) => (
          <Link
            key={link.name}
            className={`flex items-center space-x-2 text-sm font-medium transition ${
              activeLink === link.href
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
            href={link.href}
            onPress={() => setActiveLink(link.href)}
          >
            <link.icon size={18} />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavigationBar;
