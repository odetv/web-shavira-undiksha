"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Tooltip,
  Checkbox,
  Tabs,
  Tab,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button,
  ModalFooter,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import { usePathname } from "next/navigation";
import { Divider } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UndikshaLogo from "@/assets/logo/eganesha.png";
import GuestIcon from "@/assets/logo/Guest.png";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import {
  signUpManual,
  signInManual,
  signInGoogle,
  signUpGoogle,
  signOutUser,
  resetPassword,
} from "@/services/apiDatabase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

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
  const [isOpenForgotPassword, setOpenForgotPassword] = useState(false);
  const [isEmailForgotPassword, setEmailForgotPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [emailSignInManual, setEmailSignInManual] = useState("");
  const [passwordSignInManual, setPasswordSignInManual] = useState("");
  const [nameSignUpManual, setNameSignUpManual] = useState("");
  const [emailSignUpManual, setEmailSignUpManual] = useState("");
  const [passwordSignUpManual, setPasswordSignUpManual] = useState("");
  const [confirmPasswordSignUpManual, setConfirmPasswordSignUpManual] =
    useState("");
  const [photoUrlSignUpManual, setPhotoUrlSignUpManual] = useState("");

  const [name, setName] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const isEmailForgotPasswordEnabled =
    isEmailForgotPassword !== "" && isEmailForgotPassword !== "";
  const isSignInEnabled =
    emailSignInManual !== "" && passwordSignInManual !== "";
  const isSignUpEnabled =
    nameSignUpManual !== "" &&
    emailSignUpManual !== "" &&
    passwordSignUpManual !== "" &&
    confirmPasswordSignUpManual !== "" &&
    passwordSignUpManual === confirmPasswordSignUpManual;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const newPhotoUrl =
            userData?.photo_url ||
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
          setPhotoUrl(newPhotoUrl);
          setRole(userData?.role || "registered");
          setName(userData?.name || null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!photoUrlSignUpManual) {
      setPhotoUrlSignUpManual(
        "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
      );
    }
  }, [photoUrlSignUpManual]);

  const handleSignUpManual = async () => {
    if (passwordSignUpManual !== confirmPasswordSignUpManual) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }
    try {
      const user = await signUpManual(
        nameSignUpManual,
        emailSignUpManual,
        passwordSignUpManual,
        photoUrlSignUpManual
      );
      setUser(user);
      closeForm();
      window.location.reload();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleSignInManual = async () => {
    try {
      const user = await signInManual(emailSignInManual, passwordSignInManual);
      setUser(user);
      closeForm();
      window.location.reload();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      const user = await signInGoogle();
      setUser(user);
      closeForm();
      window.location.reload();
    } catch (error: any) {
      alert("Terjadi kesalahan saat login dengan Google: " + error.message);
    }
  };

  const handleSignUpGoogle = async () => {
    try {
      const user = await signUpGoogle();
      setUser(user);
      closeForm();
      window.location.reload();
    } catch (error: any) {
      alert("Terjadi kesalahan saat sign up dengan Google: " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!isEmailForgotPassword) {
      alert("Email tidak boleh kosong.");
      return;
    }

    try {
      const message = await resetPassword(isEmailForgotPassword);
      alert(message);
      closeForgotPassword(); // Menutup modal setelah berhasil
    } catch (error: any) {
      console.error("Error: ", error);
      alert(error.message); // Menampilkan pesan error jika ada
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      window.location.reload();
    } catch (error: any) {
      console.error("Logout failed: ", error);
    }
  };

  const toggleLoginPassword = () => setShowLoginPassword(!showLoginPassword);

  const toggleRegisterPassword = () =>
    setShowRegisterPassword(!showRegisterPassword);

  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const hideAllPassword = () => {
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowConfirmPassword(false);
  };

  const openForm = () => setOpenForm(true);

  const openForgotPassword = () => setOpenForgotPassword(true);
  const closeForgotPassword = () => setOpenForgotPassword(false);

  const closeForm = () => {
    setOpenForm(false);
    hideAllPassword();
  };

  const getSignInForm = () => {
    setSelected("masuk");
    hideAllPassword();
  };

  const getSignUpForm = () => {
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
          {role === "admin" && (
            <NavbarItem key="admin">
              <Link
                href="/admin"
                className={`${
                  isActive("/admin")
                    ? "text-blue-500"
                    : "text-black hover:text-blue-500"
                }`}
              >
                Administrator
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex items-center gap-4">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  {user ? (
                    <Image
                      className="rounded-full p-0.5 outline-slate-300 outline-2 outline cursor-pointer transition-all ease-in-out"
                      width={42}
                      height={42}
                      alt={photoUrl}
                      src={photoUrl || GuestIcon.src}
                    />
                  ) : (
                    <Image
                      className="rounded-full p-0.5 outline-slate-300 outline-2 outline cursor-pointer transition-all ease-in-out"
                      width={42}
                      height={42}
                      alt={photoUrl}
                      src={GuestIcon.src}
                    />
                  )}
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    textValue="profile"
                    className="h-14 gap-2 bg-slate-200"
                  >
                    {user ? (
                      <>
                        <p className="font-semibold text-wrap">{name}</p>
                        <p className="text-xs capitalize">{role}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Mode Tamu</p>
                        <p className="text-xs">Masuk untuk Gunakan Shavira</p>
                      </>
                    )}
                  </DropdownItem>
                  {user ? (
                    <>
                      <DropdownItem
                        key="explore"
                        textValue="explore"
                        color="primary"
                        className="bg-blue-500 text-white mt-1 font-semibold text-center"
                      >
                        <a href="https://undiksha.ac.id" target="_blank">
                          Explore
                        </a>
                      </DropdownItem>
                      <DropdownItem
                        onPress={handleLogout}
                        key="keluar"
                        textValue="keluar"
                        color="danger"
                        className="bg-red-500 text-white mt-1 font-semibold text-center"
                      >
                        Keluar
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem
                        key="explore"
                        textValue="explore"
                        color="primary"
                        className="bg-blue-500 text-white mt-1 font-semibold text-center"
                      >
                        <a href="https://undiksha.ac.id" target="_blank">
                          Explore
                        </a>
                      </DropdownItem>
                      <DropdownItem
                        onPress={openForm}
                        key="masuk"
                        textValue="masuk"
                        color="primary"
                        className="bg-blue-500 text-white mt-1 font-semibold text-center"
                      >
                        Masuk
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
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
          {role === "admin" && (
            <NavbarMenuItem onClick={() => setIsMenuOpen(false)}
             key="admin">
              <Link
                href="/admin"
                className={`${
                  isActive("/admin")
                    ? "text-blue-500"
                    : "text-black hover:text-blue-500"
                }`}
              >
                Administrator
              </Link>
            </NavbarMenuItem>
          )}
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
                    value={emailSignInManual}
                    onChange={(e) => setEmailSignInManual(e.target.value)}
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
                    value={passwordSignInManual}
                    onChange={(e) => setPasswordSignInManual(e.target.value)}
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Tooltip
                      showArrow={true}
                      size="sm"
                      content="Maaf, Fitur belum tersedia."
                      color="danger"
                    >
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Ingat Saya
                      </Checkbox>
                    </Tooltip>
                    <Link
                      onClick={openForgotPassword}
                      color="primary"
                      href="#"
                      className="text-sm hover:text-blue-500 cursor-pointer transition-all ease-in-out"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      disabled={!isSignInEnabled}
                      onClick={handleSignInManual}
                      className={`bg-blue-700 w-full mx-auto rounded-lg py-2 text-white hover:bg-blue-800 transition-all ease-in-out font-semibold ${
                        !isSignInEnabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Masuk
                    </button>
                    <Divider className="text-xs">Atau</Divider>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-center w-full mx-auto">
                        <button
                          onClick={handleSignInGoogle}
                          className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out"
                        >
                          <Image
                            className="w-6 h-6"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="google logo"
                            width={24}
                            height={24}
                          />
                          <p className="text-sm">Masuk dengan Google</p>
                        </button>
                      </div>
                      <div className="flex flex-row gap-1 justify-center">
                        <p className="text-sm">Belum punya akun?</p>
                        <button
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
                          onClick={getSignUpForm}
                        >
                          Daftar
                        </button>
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
                    value={nameSignUpManual}
                    onChange={(e) => setNameSignUpManual(e.target.value)}
                  />
                  <Input
                    id="emailDaftar"
                    endContent={<EmailIcon color="disabled" />}
                    isRequired
                    label="Email"
                    placeholder="Email"
                    variant="bordered"
                    value={emailSignUpManual}
                    onChange={(e) => setEmailSignUpManual(e.target.value)}
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
                    value={passwordSignUpManual}
                    onChange={(e) => setPasswordSignUpManual(e.target.value)}
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
                    value={confirmPasswordSignUpManual}
                    onChange={(e) =>
                      setConfirmPasswordSignUpManual(e.target.value)
                    }
                  />

                  <div className="flex flex-col gap-2">
                    <button
                      disabled={!isSignUpEnabled}
                      onClick={handleSignUpManual}
                      className={`bg-blue-700 w-full mx-auto rounded-lg py-2 text-white hover:bg-blue-800 transition-all ease-in-out font-semibold ${
                        !isSignUpEnabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Daftar
                    </button>

                    <Divider className="text-xs">Atau</Divider>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-center w-full mx-auto">
                        <button
                          onClick={handleSignUpGoogle}
                          className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out"
                        >
                          <Image
                            className="w-6 h-6"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="google logo"
                            width={24}
                            height={24}
                          />
                          <p className="text-sm">Daftar dengan Google</p>
                        </button>
                      </div>
                      <div className="flex flex-row gap-1 justify-center">
                        <p className="text-sm">Sudah punya akun?</p>

                        <button
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
                          onClick={getSignInForm}
                        >
                          Masuk
                        </button>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Tab>
            </Tabs>
          </div>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenForgotPassword}
        placement="center"
        hideCloseButton
        size="sm"
        className="m-4"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Lupa Password
            </ModalHeader>
            <ModalBody>
              <Input
                id="emailForgotPassword"
                endContent={<EmailIcon color="disabled" />}
                isRequired
                label="Email"
                placeholder="Masukkan email terdaftar"
                variant="bordered"
                onChange={(e) => setEmailForgotPassword(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={closeForgotPassword}
              >
                Batal
              </Button>
              <Button
                isDisabled={!isEmailForgotPasswordEnabled}
                color="primary"
                onPress={handleForgotPassword}
              >
                Kirim
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
