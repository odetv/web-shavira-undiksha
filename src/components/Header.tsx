"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import UndikshaLogo from "../assets/logo/eganesha.png";
import ExploreIcon from "@mui/icons-material/Explore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

const navItems = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/",
  },
  {
    id: "faqs",
    label: "FAQs",
    href: "/faqs",
  },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: Url) => pathname === path;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand>
          <Link
            href={"/"}
            className="flex flex-row items-center justify-center"
          >
            <Image
              width={38}
              height={38}
              src={UndikshaLogo.src}
              alt={"Logo Undiksha"}
            />
            <p className="pl-2 font-extrabold">SHAVIRA</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <Link
            href={"/"}
            className="flex flex-row items-center justify-center"
          >
            <Image
              width={38}
              height={38}
              src={UndikshaLogo.src}
              alt={"Logo Undiksha"}
            />
            <p className="pl-2 font-extrabold">SHAVIRA</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4 font-medium"
        justify="center"
      >
        {navItems.map((eachItem) => (
          <NavbarItem key={eachItem.id}>
            <Link
              href={eachItem.href}
              className={`${
                isActive(eachItem.href)
                  ? "text-blue-500 font-medium"
                  : "text-black"
              }`}
            >
              {eachItem.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="https://undiksha.ac.id/"
            variant="flat"
          >
            Explore
            <ExploreIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="flex flex-col gap-4 pt-4 font-medium">
        {navItems.map((eachItem) => (
          <NavbarMenuItem
            onClick={() => setIsMenuOpen(false)}
            key={eachItem.id}
          >
            <Link
              href={eachItem.href}
              className={`${
                isActive(eachItem.href)
                  ? "text-blue-500 font-medium"
                  : "text-black"
              }`}
            >
              {eachItem.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
