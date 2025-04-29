import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";

import HeaderRightActions from "./header/HeaderRightActions";

export const Navbar = () => {
  return (
    <HeroUINavbar className="bg-background" maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit mr-8">
          <Link className="flex justify-start items-center gap-1" href="/">
            <h1 className="text-3xl font-bold tracking-tight">
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
