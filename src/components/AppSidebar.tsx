import Link from "next/link";
import { Button } from "@heroui/button";
import { 
  HomeIcon,
  VideoCameraIcon, 
  UserIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { Search } from "lucide-react";

export function AppSidebar() {
  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app/dashboard" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: UserIcon, label: "Profile", href: "/app/profile" },
    { icon: ChartBarIcon, label: "Analytics", href: "/app/analytics" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/app/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-background border-r">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                className="w-full justify-start"
                variant="light"
                startContent={<item.icon className="w-5 h-5" />}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            className="w-full justify-start"
            variant="light"
            color="danger"
            startContent={<ArrowLeftOnRectangleIcon className="w-5 h-5" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 