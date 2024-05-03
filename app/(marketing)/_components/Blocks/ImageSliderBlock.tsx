"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Link from "next/link";

export function ImagesSliderBlock() {
  const images = [
    // "https://firebasestorage.googleapis.com/v0/b/ivan-estate.appspot.com/o/Untitled%20Project.jpg?alt=media&token=cffd14a0-1dbe-42c0-8c2f-b40d08c2805a",
    "https://firebasestorage.googleapis.com/v0/b/ivan-estate.appspot.com/o/_3849f28f-4abe-465c-8e8b-e6fb70175d56.jpg?alt=media&token=d8910397-817f-4735-841e-a631100a1b15",
    "https://firebasestorage.googleapis.com/v0/b/ivan-estate.appspot.com/o/_565bf507-24dc-4827-909f-c4caca68fc71.jpg?alt=media&token=caf1865d-71e7-4806-8d13-37eb23c133c1",
  ];

  const scrollToTarget = (target: any) => {
    const targetElement = document.querySelector(target);
    if (targetElement) {
        // Calculate the distance to scroll
        const offsetTop = targetElement.getBoundingClientRect().top;
        const scrollDistance = offsetTop - 50; // Adjust 50 for any additional offset

        window.scrollTo({
            top: scrollDistance,
            behavior: 'smooth'
        });
    }
}

  return (
    <ImagesSlider className="h-[40rem] dark:bg-black bg-white" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Automate Repetitive PDF Generation <br /> With Ease
        </motion.p>
        <Link href='' onClick={() => scrollToTarget('#trialPage')}>
          <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
              Start as Guest
            <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </Link>
      </motion.div>
    </ImagesSlider>
  );
}
