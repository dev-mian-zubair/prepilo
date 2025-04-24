"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import HeaderRightActions from "./header/HeaderRightActions";
import { useAuth } from "@/providers/AuthProvider";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSidebar } from "@/contexts/SidebarContext";

export const AppNavBar = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <HeroUINavbar 
      className="bg-background border-b [&>header]:px-3" 
      maxWidth="full" 
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit mr-4">
          <Button
            isIconOnly
            variant="light"
            className="mr-2"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>
          <Link className="flex justify-start items-center gap-1" href="/app">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">Prep</span>ilo
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex gap-2 items-center">
          <HeaderRightActions />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}; 