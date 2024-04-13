import localFont from "next/font/local";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import {ProductTrial} from "./_components/product-trial";
import { ImagesSliderBlock } from "./_components/Blocks/ImageSliderBlock";
import SpotLightProductBlock from "./_components/Blocks/SpotLightProductBlock";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LampTitleBlock } from "./_components/Blocks/LampTitleBlock";

const headingFont = localFont({
  src: "../../public/fonts/font.woff2"
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
});

const MarketingPage = () => {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="flex items-center justify-center flex-col bg-[#dedcd7] dark:bg-black">
      <div className={cn(
        "flex items-center justify-center flex-col",
        headingFont.className,
        'w-full'
      )}>
        <div className="w-full">
          <ImagesSliderBlock />
        </div>
        <div className="relative md:absolute w-auto h-auto md:left-[40px] top-[100px] md:top-[500px] z-[49]">
          <HoverBorderGradient 
              containerClassName="rounded-md"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center w-full h-full"
          >
            <SpotLightProductBlock />
          </HoverBorderGradient>
        </div>
        <div className="pt-[18rem] pb-[10rem] px-[10px] md:px-[5rem] lg:px-[10rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_-50%,black)]"></div>
            <ProductTrial />
          </div>
        <div className=" w-full h-[90rem]">
          <LampTitleBlock />
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
