"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useBasePDF } from "@/hooks/use-free-upload-pdf";
import { Cert2 } from "@/lib/basePdf/aesthitic";
import { AnotherTemp, SchoolSchedule } from "@/lib/basePdf/certPdf";

export function ThreeDCardProduct() {

  const [front, setFront] = useState(0)
  const [added, setAdded] = useState(false)

  const pdfLink: any = {
    'School Schedule': {base: SchoolSchedule, image: '/templateImage/sched.png'},
    'Certificate of Appreciation' : {base: Cert2, image: '/templateImage/cert1.png'},
    'Another Template' : {base: AnotherTemp, image: '/templateImage/anothertemp.png'}
  }

  const {
    setData,
    isUsed
  } = useBasePDF()

  const setNextBase = () => {
    if (front+1 === Object.keys(pdfLink).length) {
      return setFront(prev => prev - prev)
    }
    setFront(prev => prev + 1)
  }
  
  const onChangeBasePDF = () => {
    setData(pdfLink[Object.keys(pdfLink)[front]].base)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
    }, 1000)
  }

  
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Built-in Pdf template
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Try this template as your background for your pdf.
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <BackgroundGradient className="rounded-[22px]">
            <Image
              src={pdfLink[Object.keys(pdfLink)[front]].image}
              height="500"
              width="500"
              className="h-60 w-full object-cover rounded-[22px] group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </BackgroundGradient>
        </CardItem>
        <div className="flex justify-between items-center mt-5">
          <CardItem
            translateZ={75}
            as={"button"}
            onClick={() => setNextBase()}
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Change  →
          </CardItem>
          <CardItem
            disabled={isUsed}
            translateZ={75}
            as="button"
            onClick={() => {if(!isUsed){onChangeBasePDF()}}}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isUsed ? ('Template Disabled') : (added ? ('✔ Template Used') : ('Use My Template'))}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
