import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import {ProductTrial} from "../_components/product-trial";
import { ImagesSliderBlock } from "../_components/Blocks/ImageSliderBlock";
import SpotLightProductBlock from "../_components/Blocks/SpotLightProductBlock";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LampTitleBlock } from "../_components/Blocks/LampTitleBlock";

const headingFont = localFont({
  src: "../../../public/fonts/font.woff2"
});

const MarketingPage = () => {

  return (
    <div className="flex items-center justify-center flex-col">
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
        <div className=" w-full h-[80rem]">
          <LampTitleBlock />
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
