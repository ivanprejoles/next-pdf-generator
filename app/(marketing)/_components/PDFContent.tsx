"use client";

import React, { Dispatch, SetStateAction } from "react";
import { readFile } from "@/lib/helper";
import { read, utils } from "xlsx";

import SubmitButton from "./submitButton";
import ContentButton from "./contentButton";
import { useBasePDF } from "@/hooks/use-free-upload-pdf";

interface PDFContentInterface {
  onShow: () => void,
  setCsvData: Dispatch<SetStateAction<any[]>>,
  setCsvHeader: Dispatch<SetStateAction<string[]>>
  setPdfData: Dispatch<SetStateAction<string | ArrayBuffer | null>>,
  csvData: any[],
  pdfData: string | ArrayBuffer | null,
}
export function PDFContent({
  onShow,
  setCsvData,
  setCsvHeader,
  setPdfData,
  csvData,
  pdfData
}: PDFContentInterface) {
    
  const {
    setData
  } = useBasePDF()
  const ref = React.useRef(null);

  const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfData(null)
    try {
      if (e.target && e.target.files && e.target.files[0]) {
        readFile(e.target.files[0], 'dataURL').then(async (basePdf) => {
          setData(null)
          return setPdfData(basePdf)
        })
      }
    } catch (error) {
      return
    }
  }

  const onDownloadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newFile = event.target.files?.[0];
      if (!newFile) {
        setCsvData([])
        return
      }
      if (event.target && event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(newFile);
        reader.onload = async (event) => {
          if (!event.target?.result) {
              setCsvData([])
              return;
          }
    
            const workbook = read(event.target.result, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const dataArray = utils.sheet_to_json(worksheet);

            const keys = Object.keys(dataArray[0] as {});
            setCsvData(dataArray)
            setCsvHeader(keys)
        };
        
        reader.onerror = (error) => {
          setCsvData([])
        };
      } else {
        setCsvData([])
      }
    } catch (error) {
      return
    }
  }

  return (
    <div
      className="h-full bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative "
      ref={ref}
    >
      {/* Button */}
      <div className="flex w-full p-3 items-center justify-evenly absolute top-[20%] z-50">
          <ContentButton 
            title='Upload PDF'
            verified={pdfData !== null}
            onClick={() => {document.getElementById('pdfInput')?.click()}}
            input={(
              <input
                id='pdfInput'
                type="file"
                accept="application/pdf"
                onChange={onChangeBasePDF}
                className="hidden"
              />
            )}
          />
          <ContentButton 
            title='Upload Sheet'
            verified={csvData.length > 0}
            onClick={() => {document.getElementById('csvInput')?.click()}}
            input={(
              <input
                id='csvInput'
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={onDownloadCSV}
                className="hidden"
              />
            )}
          />
          <SubmitButton
            title="Make Template"
            disabled={csvData.length <= 0 || pdfData === null}
            onClick={onShow}
          />
      </div>

      {/* ui */}
      <div className="h-[30rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="md:text-7xl top-[30%] text-3xl lg:text-9xl font-bold text-center text-white relative z-20 w-full h-[40%]">
      </div>
      <div className="w-full h-full relative">
        {/* Gradients */}
        <div className="absolute inset-x-6 sm:inset-x-20 top-[25%] bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-10 sm:inset-x-20 top-[25%] bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-[40%] top-[25%] bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-[40%] top-[25%] bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
      </div>
    </div>
    </div>
  );
}