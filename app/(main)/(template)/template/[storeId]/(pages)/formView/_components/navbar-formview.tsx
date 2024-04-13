'use client'

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import React, { useState } from "react"

interface FormViewNavbarProps {
    mode: "form" | "viewer" | 'design',
    onChangeMode: (mode: 'form'|'viewer'|'design') => void,
    onLoadTemplate?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onGeneratePDF?: () => void,
    onChangeBase?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onDownloadTemplate?: () => void,
    onResetTemplate?: () => void,
    onLangChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    lang?: "en" | "ja" | "ar" | "th" | "pl" | "it" | "de",
}

  
export function FormViewNavbar({
    mode,
    onChangeMode,
    onLoadTemplate,
    onGeneratePDF,
    onChangeBase,
    onDownloadTemplate,
    onResetTemplate,
    onLangChange,
    lang
}: FormViewNavbarProps) {

    const fileClick = () => {
        const fileInput = document.getElementById('loadtemp');
        fileInput?.click();
    }

    const changeBaseclick = () => {
        const fileInput = document.getElementById('basetemp');
        fileInput?.click();
    }

    return (
        <header
            className=" flex-row justify-between items-center p-2 w-auto h-[56px] z-20 repative md:absolute"
            style={{ display: "flex", marginRight: 120, }}
        >
            <HoverBorderGradient 
                containerClassName="rounded-md"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center"
            >
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>{mode}</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value={mode}>
                                <MenubarRadioItem onClick={() => {onChangeMode('design'); console.log(1)}} value="design">Design</MenubarRadioItem>
                                <MenubarRadioItem onClick={() => {onChangeMode('form'); console.log(2)}} value="form">Form</MenubarRadioItem>
                                <MenubarRadioItem onClick={() => {onChangeMode('viewer'); console.log(3)}} value="viewer">View</MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Template</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem onClick={fileClick}>
                                        Upload Template <input id="loadtemp" type="file" accept="application/json" onChange={onLoadTemplate} className="hidden" />
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSub>
                                <MenubarSubTrigger>PDFs</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem onClick={onGeneratePDF}>
                                        Generate PDFs
                                    </MenubarItem>
                                    {mode === 'design' && (
                                        <MenubarItem onClick={changeBaseclick}>
                                            Generate Base PDF <input id="basetemp" type="file" accept="application/pdf" onChange={onChangeBase} className="hidden" />
                                        </MenubarItem>
                                    )}
                                    <MenubarItem>
                                        Download PDFs
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSub>
                                <MenubarSubTrigger>Inputs</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>
                                        Upload Inputs
                                    </MenubarItem>
                                    <MenubarItem>
                                        Download Inputs
                                    </MenubarItem>
                                    <MenubarItem>
                                        Reset Inputs
                                    </MenubarItem>
                                    <MenubarItem>
                                        Save Inputs
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSub>   
                                {lang && (
                                    <MenubarMenu>
                                        <Select>
                                            <SelectTrigger className="w-[180px] border-0 bg-transparent">
                                                <SelectValue onChange={onLangChange} placeholder={lang} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectLabel>Language</SelectLabel>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="ja">Japanese</SelectItem>
                                                <SelectItem value="ar">Arabic</SelectItem>
                                                <SelectItem value="th">Thai</SelectItem>
                                                <SelectItem value="pl">Polish</SelectItem>
                                                <SelectItem value="it">Italian</SelectItem>
                                                <SelectItem value="de">German</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </MenubarMenu>
                                )}
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </HoverBorderGradient>
        </header>
    )
}
