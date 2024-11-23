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
  Link,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import UndikshaLogo from "../assets/logo/eganesha.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Beranda", "Kontak", "FAQs", "Explore"];

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
          <Link href="/" color="foreground">
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
          <Link href="/" color="foreground">
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
        className="hidden sm:flex gap-4 font-semibold"
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="#">
            Beranda
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="https://missu.undiksha.ac.id/#kontak">
            Kontak
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="https://missu.undiksha.ac.id/#faq">
            FAQs
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            className="pl-6"
            endContent={<ArrowOutwardIcon />}
            as={Link}
            color="primary"
            href="https://undiksha.ac.id/"
            variant="flat"
          >
            Explore
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="flex flex-col gap-4 pl-6 pt-4 font-semibold">
        <NavbarMenuItem>
          <Link color="foreground" href="#">
            Beranda
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="https://missu.undiksha.ac.id/#kontak">
            Kontak
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="https://missu.undiksha.ac.id/#faq">
            FAQs
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="https://undiksha.ac.id/">
            Explore
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
