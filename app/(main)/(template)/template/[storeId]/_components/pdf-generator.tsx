'use client'

import { cloneDeep, downloadJsonFile, generatePDF, getFontsData, getPlugins, getTemplate, handleLoadTemplate, readFile } from "@/lib/helper";
import { Lang, Template, checkTemplate } from "@pdfme/common";
import { Designer, Form, Viewer } from "@pdfme/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormViewNavbar } from "../(pages)/formView/_components/navbar-formview";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";
import axios from "axios";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Menubar } from "@radix-ui/react-menubar";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const headerHeight = 65;

type Mode = "form" | "viewer" | 'design';

const PdfGenerator = () => {
    const UserRef = useRef<HTMLDivElement | null>(null); //2
    const User = useRef<Viewer | Form | Designer | null>(null); //1
    const [lang, setLang] = useState<Lang>('en'); //0
    const [prevUserRef, setPrevUserRef] = useState<Form | Viewer | Designer | null>(null); //1
    const params = useParams()

    const [mode, setMode] = useState<Mode>(
        (localStorage.getItem('mode') as Mode ?? 'design')
    )

    const buildUser = (mode: Mode) => {
        
        const fetchData = async () => {
            await axios.post(`/api/template/${params.storeId}`)
            .catch((error) => {
                console.log(error)
            }).then((response) => {
                console.log(response)
            })
        }

        let template: Template = getTemplate();
        let inputs = template.sampledata ?? [{}];
        try {
            fetchData()
            let templateString = localStorage.getItem(`${params.storeId}template`)
            const templateJson = templateString
              ? JSON.parse(templateString)
              : getTemplate();
            checkTemplate(templateJson)
            template  = templateJson as Template
        } catch (error) {
            localStorage.getItem(`${params.storeId}template`)
        }

        getFontsData().then((font) => {
            if (UserRef.current) {
                if (mode === 'design') {
                    User.current = new Designer({
                        domContainer: UserRef.current,
                        template,
                        options: {font},
                        plugins: getPlugins(),
                    });
                    User.current.onSaveTemplate(onLocalSaveTemplate)
                } else {
                    User.current = new (mode === 'form' ? Form : Viewer)({
                        domContainer: UserRef.current,
                        template,
                        inputs,
                        options: {
                            font,
                            labels: {'clear': 'clear'},
                            theme: {
                                token: {
                                    colorPrimary: '#25c2a0'
                                },
                            },
                        },
                        plugins: getPlugins(),
                    })
                } 
                const child = UserRef?.current.children[0] as HTMLElement
                child.style.backgroundColor = 'transparent';
            }
        });
    }

    // now works on designer, not only input and form
    const onChangeMode = (type: Mode) => {
        const value = type as Mode;
        setMode(value)
        localStorage.setItem('mode', value)
        buildUser(value)
    }
    
    //R
    const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(mode)
        if (e.target && e.target.files && mode === 'design') {
            readFile(e.target.files[0], 'dataURL').then( async (basePdf) => {
                if (User.current) {
                    User.current.updateTemplate(
                        Object.assign(cloneDeep(User.current.getTemplate()), {
                            basePdf
                        })
                    )  
                }
            })
        } else {

        }
    }

    // R
    //for local storage only (only works on designer)
    const onDownloadTemplate = () => {
        if (User.current && mode === 'design') {
          downloadJsonFile(User.current.getTemplate(), `${params.storeId}template`);
          console.log(User.current.getTemplate());
        }
      };


    //needs to be save in the server ( no server yet, and only works on designer )
    const onLocalSaveTemplate = (template?: Template) => {
        if (User.current && mode === 'design') {
            localStorage.setItem(
                `${params.storeId}template`,
                JSON.stringify(template || User.current.getTemplate())
            )
            alert('Template Saved')
        }
    }

    //save on database
    const onRemoteSaveTemplate = async () => {
        if (User.current && localStorage.getItem(`${params.storeId}template`) && mode === 'design') {
            const localStorageData = localStorage.getItem(`${params.storeId}template`)
            await axios.patch(`/api/template/${params.storeId}`, {templateData: localStorageData})
            .catch((error) => {
                console.log(error)
            })
            .then(() => {
                console.log('done')
            })
            
        }
    }
    
    //needs to have server to reset template ( only works on designer)
    const onResetTemplate = () => {
        if (User.current && mode === 'design') {
            User.current.updateTemplate(getTemplate())
            localStorage.removeItem('template')
        }
    }

    if (UserRef != prevUserRef) {
        if (prevUserRef && User.current) {
            console.log('useref prev')
            User.current.destroy();
        }
        buildUser(mode);
        setPrevUserRef(UserRef);
    }


    const fileClick = () => {
        const fileInput = document.getElementById('loadtemp');
        fileInput?.click();
    }

    const changeBaseclick = () => {
        const fileInput = document.getElementById('basetemp');
        fileInput?.click();
    }
    
    return (  
        <BackgroundGradient className="rounded-[22px] w-full bg-white dark:bg-zinc-900">
            {/* <BackgroundBeams /> */}
            {/* {(mode === 'design')
              ? (      
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
                                <MenubarSubTrigger>{mode}</MenubarSubTrigger>
                                <MenubarContent>
                                    <MenubarRadioGroup value={mode}>
                                        <MenubarRadioItem onClick={() => {onChangeMode('design')}} value="design">Design</MenubarRadioItem>
                                        <MenubarRadioItem onClick={() => {onChangeMode('form')}} value="form">Form</MenubarRadioItem>
                                        <MenubarRadioItem onClick={() => {onChangeMode('viewer')}} value="viewer">View</MenubarRadioItem>
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
                                                Upload Template <input id="loadtemp" type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, User.current)} className="hidden" />
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarSub>
                                        <MenubarSubTrigger>PDFs</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => generatePDF(User.current)}>
                                                Generate PDFs
                                            </MenubarItem>
                                            {mode === 'design' && (
                                                <MenubarItem onClick={changeBaseclick}>
                                                    Generate Base PDF <input id="basetemp" type="file" accept="application/pdf" onChange={(e) => onChangeBasePDF(e)} className="hidden" />
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
                                        <MenubarMenu>
                                            <Select onValueChange={(value: Lang) => setLang(value)} defaultValue={lang}>
                                                <SelectTrigger className="w-[180px] border-0 bg-transparent">
                                                    <SelectValue placeholder={lang} />
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
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger>Edit</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem>
                                        Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarSub>
                                        <MenubarSubTrigger>Find</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem>Find...</MenubarItem>
                                            <MenubarItem>Find Next</MenubarItem>
                                            <MenubarItem>Find Previous</MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarSeparator />
                                    <MenubarItem>Cut</MenubarItem>
                                    <MenubarItem>Copy</MenubarItem>
                                    <MenubarItem>Paste</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </HoverBorderGradient>
                </header> )
                : (
                    <FormViewNavbar
                        mode={mode}
                        onChangeMode={onChangeMode}
                        onLoadTemplate={(e: React.ChangeEvent<HTMLInputElement>) => handleLoadTemplate(e, User.current)}
                        onGeneratePDF={() =>generatePDF(User.current)}
                    />
                )
            } */}
    <header className="z-50" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginRight: 120, }}>
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{mode}</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value={mode}>
                        <MenubarRadioItem onClick={() => {onChangeMode('design')}} value="design">Design</MenubarRadioItem>
                        <MenubarRadioItem onClick={() => {onChangeMode('form')}} value="form">Form</MenubarRadioItem>
                        <MenubarRadioItem onClick={() => {onChangeMode('viewer')}} value="viewer">View</MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
        <span style={{ margin: "0 1rem" }}>:</span>
        <select onChange={(e) => {
          setLang(e.target.value as Lang)
          if (User.current) {
            User.current.updateOptions({ lang: e.target.value as Lang })
          }
        }} value={lang}>
          <option value="en">English</option>
          <option value="ja">Japanese</option>
          <option value="ar">Arabic</option>
          <option value="th">Thai</option>
          <option value="pl">Polish</option>
          <option value="it">Italian</option>
          <option value="de">German</option>
        </select>
        <span style={{ margin: "0 1rem" }}>/</span>
        <label style={{ width: 180 }}>
          Change BasePDF
          <input type="file" accept="application/pdf" onChange={onChangeBasePDF} />
        </label>
        <span style={{ margin: "0 1rem" }}>/</span>
        <label style={{ width: 180 }}>
          Load Template
          <input type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, User.current)} />
        </label>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onDownloadTemplate}>Download Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={() => onLocalSaveTemplate()}>Save Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onResetTemplate}>Reset Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={() => generatePDF(User.current)}>Generate PDF</button>
      </header>
      
        <div 
            ref={UserRef} 
            style={{ width: '100%', height: `calc(97vh - ${headerHeight}px)` }} 
            className={cn(
                "rounded-l-[22px] overflow-hidden bg-transparent z-[20]",
                (mode === 'design' && 'rounded-r-[22px]')
            )}
        />
        </BackgroundGradient>
    );
}
 

export default PdfGenerator;