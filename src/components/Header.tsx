"use client";
import { useEffect, useState } from "react";
import React from "react";
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
  Checkbox,
  Tabs,
  Tab,
} from "@nextui-org/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import UndikshaLogo from "../assets/logo/eganesha.png";
import { usePathname } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";
import GuestIcon from "@/assets/logo/Guest.png";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";
import {
  signUpManual,
  signInManual,
  signUpGoogle,
  signInGoogle,
} from "@/services/apiDatabase";
import firebase from "firebase/app";
import "firebase/auth";

const navItems = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/",
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/faq",
  },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: Url) => pathname === path;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | number>("masuk");
  const [isOpenForm, setOpenForm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [nameRegister, setNameRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [confirmPasswordRegister, setConfirmPasswordRegister] = useState("");

  // Fungsi untuk meng-handle login manual
  const handleLoginManual = async () => {
    try {
      const result = await signInManual(emailLogin, passwordLogin);
      console.log("Login berhasil", result);
      // Lakukan sesuatu dengan data login, seperti redirect atau simpan session
    } catch (error) {
      console.error("Login gagal", error);
    }
  };

  // Fungsi untuk meng-handle register manual
  const handleRegisterManual = async () => {
    if (passwordRegister !== confirmPasswordRegister) {
      alert("Password dan konfirmasi password tidak cocok");
      return;
    }
    try {
      const result = await signUpManual({
        name: nameRegister,
        email: emailRegister,
        password: passwordRegister,
        photo_url: "", // Atau bisa diambil dari input jika ada
        role: "user", // Sesuaikan dengan role
        status: "active",
      });
      console.log("Registrasi berhasil", result);
      // Lakukan sesuatu setelah registrasi berhasil, misal login otomatis
    } catch (error) {
      console.error("Registrasi gagal", error);
    }
  };

  // Tambahkan di dalam fungsi handleGoogleSignIn dan handleGoogleSignUp
  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const idToken = await result.user.getIdToken();
    await signInGoogle(idToken);
  };

  const handleGoogleSignUp = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const idToken = await result.user.getIdToken();
    await signUpGoogle(idToken);
  };

  // Fungsi untuk menampilkan password login
  const toggleLoginPassword = () => setShowLoginPassword(!showLoginPassword);

  // Fungsi untuk menampilkan password register
  const toggleRegisterPassword = () =>
    setShowRegisterPassword(!showRegisterPassword);

  // Fungsi untuk menampilkan password confirm
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Fungsi untuk menyembunyikan semua password
  const hideAllPassword = () => {
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowConfirmPassword(false);
  };

  // Fungsi untuk membuka modal Form
  const openForm = () => setOpenForm(true);
  const closeForm = () => {
    setOpenForm(false);
    hideAllPassword();
  };

  // Fungsi untuk beralih autentikasi
  const getLoginForm = () => {
    setSelected("masuk");
    hideAllPassword();
  };
  const getRegisterForm = () => {
    setSelected("daftar");
    hideAllPassword();
  };

  return (
    <>
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
              <p className="pl-2 font-extrabold text-black">SHAVIRA</p>
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
              <p className="pl-2 font-extrabold text-black">SHAVIRA</p>
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
                    ? "text-blue-500"
                    : "text-black hover:text-blue-500"
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
              onPress={openForm}
              color="primary"
              variant="flat"
              className="font-semibold"
            >
              Masuk
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
                    ? "text-blue-500"
                    : "text-black hover:text-blue-500"
                }`}
              >
                {eachItem.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <Modal
        placement="center"
        isOpen={isOpenForm}
        onOpenChange={closeForm}
        backdrop="blur"
        className="p-4 m-2"
      >
        <ModalContent>
          <div className="flex w-full flex-col">
            <Tabs
              aria-label="Options"
              variant="underlined"
              className="flex w-full justify-center"
              color="primary"
              selectedKey={selected}
              onSelectionChange={setSelected}
              onClick={hideAllPassword}
            >
              <Tab key="masuk" title="Masuk">
                <ModalHeader className="flex flex-col text-center">
                  <p>Masuk</p>
                  <p className="pb-2 text-sm font-normal">
                    Jelajahi Undiksha bersama Shavira
                  </p>
                </ModalHeader>
                <ModalBody>
                  <Input
                    id="emailMasuk"
                    endContent={<EmailIcon color="disabled" />}
                    isRequired
                    label="Email"
                    placeholder="Email"
                    variant="bordered"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                  />
                  <Input
                    id="passwordMasuk"
                    isRequired
                    label="Password"
                    placeholder="Password"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleLoginPassword}
                      >
                        {showLoginPassword ? (
                          <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={showLoginPassword ? "text" : "password"}
                    variant="bordered"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                    >
                      Ingat Saya
                    </Checkbox>
                    <Tooltip
                      showArrow={true}
                      size="sm"
                      content="Maaf, Fitur belum tersedia."
                      color="danger"
                    >
                      <Link color="primary" href="#" className="text-sm">
                        Lupa Password?
                      </Link>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleLoginManual}
                      className="bg-blue-700 w-full mx-auto rounded-lg py-2 text-white hover:bg-blue-800 transition-all ease-in-out font-semibold"
                    >
                      Masuk
                    </button>
                    <Divider className="text-xs">Atau</Divider>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-center w-full mx-auto">
                        <button className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out">
                          <Image
                            className="w-6 h-6"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="google logo"
                            width={24}
                            height={24}
                          />
                          <p className="text-sm">Lanjutkan dengan Google</p>
                        </button>
                      </div>
                      <div className="flex flex-row gap-1 justify-center">
                        <p className="text-sm">Belum punya akun?</p>
                        <Link
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
                          size="sm"
                          onPress={getRegisterForm}
                        >
                          Daftar
                        </Link>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Tab>
              <Tab key="daftar" title="Daftar">
                <ModalHeader className="flex flex-col text-center">
                  <p>Daftar</p>
                  <p className="pb-2 text-sm font-normal">
                    Komunikasi dengan Shavira kapan saja
                  </p>
                </ModalHeader>
                <ModalBody>
                  <Input
                    endContent={<PersonIcon color="disabled" />}
                    isRequired
                    label="Nama Lengkap"
                    placeholder="Nama Lengkap"
                    variant="bordered"
                    value={nameRegister}
                    onChange={(e) => setNameRegister(e.target.value)}
                  />
                  <Input
                    id="emailDaftar"
                    endContent={<EmailIcon color="disabled" />}
                    isRequired
                    label="Email"
                    placeholder="Email"
                    variant="bordered"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                  />
                  <Input
                    id="passwordDaftar"
                    isRequired
                    label="Password"
                    placeholder="Password"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleRegisterPassword}
                      >
                        {showRegisterPassword ? (
                          <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={showRegisterPassword ? "text" : "password"}
                    variant="bordered"
                    value={passwordRegister}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                  />
                  <Input
                    id="passwordDaftarKonfirmasi"
                    isRequired
                    label="Konfirmasi Password"
                    placeholder="Konfirmasi Password"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={showConfirmPassword ? "text" : "password"}
                    variant="bordered"
                    value={confirmPasswordRegister}
                    onChange={(e) => setConfirmPasswordRegister(e.target.value)}
                  />

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleRegisterManual}
                      className="bg-blue-700 w-full mx-auto rounded-lg py-2 text-white hover:bg-blue-800 transition-all ease-in-out font-semibold"
                    >
                      Daftar
                    </button>

                    <Divider className="text-xs">Atau</Divider>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-center w-full mx-auto">
                        <button className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out">
                          <Image
                            className="w-6 h-6"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="google logo"
                            width={24}
                            height={24}
                          />
                          <p className="text-sm">Lanjutkan dengan Google</p>
                        </button>
                      </div>
                      <div className="flex flex-row gap-1 justify-center">
                        <p className="text-sm">Sudah punya akun?</p>

                        <Link
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
                          onPress={getLoginForm}
                        >
                          Masuk
                        </Link>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Tab>
            </Tabs>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
