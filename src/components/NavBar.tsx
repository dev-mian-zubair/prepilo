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

import { title } from "./primitives";
import HeaderRightActions from "./header/HeaderRightActions";

export const Navbar = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <HeroUINavbar maxWidth="full" position="sticky" className="bg-background">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <span className={title({ size: "xxs", color: "blue" })}>Prepilo</span>
          </Link>
        </NavbarBrand>
        {!loading && user && (
          <>
            <NavbarItem className="h-full">
              <Link 
                href="/dashboard" 
                className={`transition-all duration-200 font-semibold h-full flex items-center px-4 ${
                  isActive('/dashboard')
                    ? 'text-background-foreground border-b-2 border-background-foreground'
                    : 'text-secondary'
                }`}
              >
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem className="h-full">
              <Link 
                href="/interviews" 
                className={`transition-all duration-200 font-semibold h-full flex items-center px-4 ${
                  isActive('/interviews')
                    ? 'text-background-foreground border-b-2 border-background-foreground'
                    : 'text-secondary'
                }`}
              >
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
