"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";
import { ChartPie, Video } from "lucide-react";

// import { title } from "./primitives";
import HeaderRightActions from "./header/HeaderRightActions";

export const Navbar = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <HeroUINavbar className="bg-background" maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit mr-8">
          <Link className="flex justify-start items-center gap-1" href="/">
            <h1 className="text-3xl font-bold tracking-tight">
              Prep<span className="text-primary">ilo</span>
            </h1>
          </Link>
        </NavbarBrand>
        {!loading && user && (
          <>
            <NavbarItem className="h-full">
              <Link 
                href="/dashboard" 
                className={`transition-all duration-200 font-semibold h-full flex items-center gap-2 px-2 ${
                  isActive('/dashboard')
                    ? 'text-success'
                    : 'text-background-foreground'
                }`}
              >
                <ChartPie size={18} />
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem className="h-full">
              <Link 
                href="/interviews" 
                className={`transition-all duration-200 font-semibold h-full flex items-center gap-2 px-2 ${
                  isActive('/interviews')
                    ? 'text-success'
                    : 'text-background-foreground'
                }`}
              >
                <Video size={18} />
                Interviews
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex gap-2 items-center">
          <HeaderRightActions />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
