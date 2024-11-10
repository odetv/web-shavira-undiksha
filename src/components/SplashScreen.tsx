import React, { useEffect, useState } from "react";
import anime from "animejs";
import Image from "next/image";
import Logo from "../assets/logo/eganesha.png";

const SplashScreen: React.FC<{ finishLoading: () => void }> = ({
  finishLoading,
}) => {
  useEffect(() => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });
    loader.add({
      targets: "#splashscreen",
      delay: 1,
      scale: 1.5,
      duration: 2500,
      easing: "easeInOutExpo",
    });
  }, [finishLoading]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-white">
      <div
        id="splashscreen"
        className="flex flex-col justify-center items-center gap-2"
      >
        <Image width={100} height={100} alt="Logo" src={Logo.src} />
        <p className="text-base sm:text-xl font-medium">Shavira Undiksha</p>
      </div>
    </div>
  );
};

export default SplashScreen;
