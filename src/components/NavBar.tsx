"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { useAuth } from "@/providers/AuthProvider";

import { title } from "./primitives";
import HeaderRightActions from "./header/HeaderRightActions";

export const Navbar = () => {
  const { user, loading } = useAuth();

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
            <NavbarItem>
              <Link 
                href="/dashboard" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link 
                href="/interviews" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
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
