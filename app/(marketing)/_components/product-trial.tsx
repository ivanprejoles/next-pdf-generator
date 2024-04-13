"use client";

import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import {PDFContent} from "./PDFContent";
import FreeTemplateGenerator from "./free-template-generator";
import { useBasePDF } from "@/hooks/use-free-upload-pdf";

export function ProductTrial() {
    const [showContent, setShowContent] = useState(false)
    const [csvData, setCsvData] = useState<any[]>([])
    const [csvHeader, setCsvHeader] = useState<string[]>([])
    const [pdfData, setPdfData]= useState<string|ArrayBuffer|null>(null)
    
    const {
      data,
      setUse
    } = useBasePDF()

    useEffect(() => {
      if (data !== null && data !== '') {
        setPdfData(data)
      }
    }, [data])
    
  return (
      <BackgroundGradient className="rounded-[22px] w-full p-3 sm:p-5 bg-slate-100 dark:bg-zinc-900">
        <div 
            className="
                text-xs 
                space-x-1 
                bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] 
                bg-[length:200%_100%]  
                inline-flex
                animate-shimmer 
                text-[0.6rem] 
                items-center 
                justify-center 
                rounded-full 
                border 
                border-slate-800
                dark:border-cyan-800
                font-bold 
                pl-4 
                pr-1 
                py-1 
                text-white
                dark:text-cyan-400 
                transition-colors 
                outline-none 
                ring-1 
                ring-slate-400
                dark:ring-cyan-400 
                ring-offset-1 
                ring-offset-slate-50
                dark:ring-offset-cyan-400
            "
        >
            <span id="trialPage">Try it here </span>
            <span className="bg-zinc-700 rounded-full  text-[0.6rem] px-2 py-0 text-white dark:text-cyan-400 ">
                Free
            </span>
        </div>
        <div className="my-4 w-full min-h-[20rem] h-auto">
          {showContent 
            ? (
              <FreeTemplateGenerator
                onHide={() => setShowContent(false)}
                csvData={csvData}
                csvHeader={csvHeader} 
                pdfData={pdfData}
              />)
            : (
              <PDFContent 
                onShow={() => {setShowContent(true); setUse(false)}}
                setCsvData={setCsvData}  
                setCsvHeader={setCsvHeader}
                setPdfData={setPdfData}
                csvData={csvData}
                pdfData={pdfData}
              />) 
          }
        </div>
        <p  className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          PDF automation
        </p>
 
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {"This template automation is free to use, with limited features from main model inside the page. Don't worry, everyhing is free."}
        </p>
      </BackgroundGradient>
  );
}