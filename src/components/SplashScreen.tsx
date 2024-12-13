import React, { useEffect, useState } from "react";
import Image from "next/image";
import anime from "animejs";
import Logo from "@/assets/logo/eganesha.png";

const SplashScreen: React.FC<{ finishLoading: () => void }> = ({
  finishLoading,
}) => {
  useEffect(() => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });
    loader.add({
      targets: "#splashscreen",
      delay: 0,
      scale: 1.25,
      duration: 2000,
      easing: "easeInOutExpo",
    });
  }, [finishLoading]);

  return (
    <div className="flex min-h-screen min-w-full items-center justify-center bg-white">
      <div
        id="splashscreen"
        className="flex flex-col justify-center items-center gap-2 -mt-16"
      >
        <Image width={100} height={100} alt="Logo" src={Logo.src} />
        <p className="text-base sm:text-xl font-bold">Shavira Undiksha</p>
      </div>
    </div>
  );
};

export default SplashScreen;
