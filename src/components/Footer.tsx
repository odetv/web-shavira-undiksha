import Link from "next/link";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import ArticleIcon from "@mui/icons-material/Article";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import UndikshaLogo from "../assets/logo/undiksha.png";

export default function Footer() {
  return (
    <footer className="px-4 divide-y divide-slate-400 bg-[#03097d] text-white">
      <div className="container flex flex-col justify-between sm:items-center py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        <div className="lg:w-1/3">
          <div className="flex justify-center space-x-3 lg:justify-start">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#2aa9e0]">
                <Image width={96} height={96} src={UndikshaLogo.src} alt="" />
              </div>
              <span className="text-xl sm:text-2xl font-semibold uppercase">
                Undiksha Virtual Assistant
              </span>
              <p className="text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                Website Resmi Helpdesk Shavira (Undiksha Virtual Assistant).
                Chatbot bantuan informasi dan layanan akademik untuk civitas
                akademik di Universitas Pendidikan Ganesha.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 text-sm gap-x-3 gap-y-8 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="uppercase font-bold text-gray-50">Kontak Kami</div>
            <div className="flex flex-col gap-1">
              <div title="Alamat" className="flex items-center py-0.5">
                <LocationOnIcon />
                <p className="pl-2 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                  Jalan Udayana No.11 Singaraja - Bali 81116
                </p>
              </div>
              <div title="Telepon" className="flex items-center py-0.5">
                <CallIcon />
                <p className="pl-2 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                  (0362) 22570
                </p>
              </div>
              <div title="Telepon" className="flex items-center py-0.5">
                <ArticleIcon />
                <p className="pl-2 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                  (0362) 25735
                </p>
              </div>
              <div title="Email" className="flex items-center py-0.5">
                <EmailIcon />
                <p className="pl-2 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                  humas@undiksha.ac.id
                </p>
              </div>
              <div title="Website" className="flex items-center py-0.5">
                <LanguageIcon />
                <p className="pl-2 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                  www.undiksha.ac.id
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="tracki uppercase font-bold text-gray-50">HALAMAN</h3>
            <ul className="space-y-1 text-tiny sm:text-sm md:text-sm lg:text-sm xl:text-sm">
              <li key="beranda">
                <Link
                  rel="noopener noreferrer"
                  href="/#beranda"
                  className="hover:text-[#d79127] transition-all ease-in-out"
                >
                  Beranda
                </Link>
              </li>
              <li key="kontak">
                <Link
                  rel="noopener noreferrer"
                  href="/#kontak"
                  className="hover:text-[#d79127] transition-all ease-in-out"
                >
                  Kontak
                </Link>
              </li>
              <li key="faq">
                <Link
                  rel="noopener noreferrer"
                  href="/#faq"
                  className="hover:text-[#d79127] transition-all ease-in-out"
                >
                  FAQs
                </Link>
              </li>
              <li key="explore">
                <Link
                  rel="noopener noreferrer"
                  href="https://undiksha.ac.id/"
                  className="hover:text-[#d79127] transition-all ease-in-out"
                >
                  Explore
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-4 text-[12px] text-center text-gray-200">
        <p rel="noopener noreferrer">
          <Link
            href=""
            className="hover:text-[#d79127] transition-all ease-in-out"
          >
            Hak Cipta © Universitas Pendidikan Ganesha
          </Link>
        </p>
      </div>
    </footer>
  );
}
