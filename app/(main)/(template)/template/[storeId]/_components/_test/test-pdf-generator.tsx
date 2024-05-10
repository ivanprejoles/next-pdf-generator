'use client'

import { cloneDeep, downloadJsonFile, generatePDF, getFontsData, getPlugins, getTemplate, handleLoadTemplate, readFile } from "@/lib/helper";
import { Lang, Template, checkTemplate } from "@pdfme/common";
import { Designer, Form, Viewer } from "@pdfme/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { cn } from "@/lib/utils";
import axios from "axios";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { addTemplate, removeTemplate } from "@/lib/reduxFeatures/templateslice";
import { useDispatch, useSelector } from 'react-redux';
import { useShareModal } from "@/hooks/use-share-link-modal";
import { Button } from "@/components/ui/button";
import { FaRegFileImage } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { MdDelete, MdDownload } from "react-icons/md";
import TooltipWrap from "@/components/tool-tip-wrapper";

const headerHeight = 65;

type Mode = "form" | "viewer" | 'design';

const PdfGenerator = () => {
    const dispatch = useDispatch()
    const reduxTemplate = useSelector((state: any) => state.userTemplate.value.templates)
    const reduxSwitcher = useSelector((state: any) => state.userTemplate.value.switcher)
    const {storeId} = useParams<{storeId: string}>()
    const {
        onOpen
    } = useShareModal()

    const UserRef = useRef<HTMLDivElement | null>(null);
    const User = useRef<Viewer | Form | Designer | null>(null); 
    
    const [lang, setLang] = useState<Lang>('en');
    const [mode, setMode] = useState<Mode>(
        (localStorage.getItem('mode') as Mode ?? 'design')
    )
    let fetching = useRef(true);

    // add auto same such as settimeout
    // add checkbox
    
    useEffect(() => {
        let template: Template = getTemplate()
        const fetchData = async () => {
            await axios.post(`/api/template/${storeId}`, {emptyTemplate: JSON.stringify(template)})
            .catch((error) => {
                fetching.current = true
                console.log(error)
            }).then((response) => {
                fetching.current = true
                dispatch(addTemplate({key: storeId, value: JSON.parse(response?.data.templateData)}))
                console.log('http request')
            })
        }
        if (!reduxTemplate[storeId]) {
            if (fetching.current) {
                fetching.current = false
                fetchData()
                console.log('data fetching')
            }
        } else {
            try {
                if (reduxTemplate[storeId]) {
                    console.log('data redux')
                    template = reduxTemplate[storeId] as Template
                    let inputs = template.sampledata ?? [{}];
                    checkTemplate(template)
                    getFontsData().then((font) => {
                        if (UserRef.current) {
                            if (mode === 'design') {
                                User.current = new Designer({
                                    domContainer: UserRef.current,
                                    template,
                                    options: {
                                        font,
                                        theme: {
                                          token: {
                                            colorPrimary: 'blue',
            
                                          },
                                        },
                                    },
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
        
                        return () => {
                            if (User.current) {
                                User.current.destroy();
                            }
                        };
                    })
                }
            } catch (error) {
                console.log('error catch')
                reduxTemplate[storeId]
            }
        }
    }, [ mode, storeId, reduxTemplate ])
        
                                                                                                                                            
    // now works on designer, not only in the input and form
    const onChangeMode = (type: Mode) => {
        
        const value = type as Mode;
        if (mode === 'design') {
            onLocalSaveTemplate()
        }

        setMode(value)
        localStorage.setItem('mode', value)
    }
    
    // changing the base pdf as background
    const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(User.current)
        if (e.target && e.target.files && mode === 'design') {
            console.log('base changing')
            readFile(e.target.files[0], 'dataURL').then( async (basePdf) => {
                if (User.current) {
                    User.current.updateTemplate(
                        Object.assign(cloneDeep(User.current.getTemplate()), {
                            basePdf
                        })
                    )
                }
            })
        }
    }

    // downloads the template into your device to be used when uploading the template
    const onDownloadTemplate = () => {
        if (User.current && mode === 'design') {
          downloadJsonFile(User.current.getTemplate(), `template`);
        }
      };


    // saves data to local storage. It's essential to update the data by saving it inside  the local storage to persist the data when changing the mode
    // it's needed to have a database to save updated data
    const onLocalSaveTemplate = () => {
        if (User.current && mode === 'design') {
            dispatch(addTemplate({key: storeId, value: User.current.getTemplate()}))
        }
    }

    // localstorage data will be saved manually in the server
    const onRemoteSaveTemplate = async () => {
        if (User.current && reduxTemplate[storeId] && mode === 'design') {
            const userTemplate = User.current.getTemplate()
            await axios.patch(`/api/template/${storeId}`, {templateData: JSON.stringify(userTemplate)})
            .catch((error) => {
                console.log(error)
            })
            .then((response: any) => {
                if (response.status === 200 && reduxTemplate[storeId] !== userTemplate) {
                    onLocalSaveTemplate()
                }
            })
            
        }
    }
    
    // resets the local storage template
    // database needs localstorage of this template to manually save the data to the server, or else data will only be in the local storage
    const onResetTemplate = () => {
        if (User.current && mode === 'design') {
            User.current.updateTemplate(getTemplate())
            dispatch(removeTemplate({key: storeId}))
        }
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
                                <MenubarTrigger>{mode}</MenubarTrigger>
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
                                    <MenubarSub>
                                        <MenubarSubTrigger>Template</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={fileClick}>
                                                Upload Template <input id="loadtemp" type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, User.current)} className="hidden" />
                                            </MenubarItem>
                                            <MenubarItem onClick={onDownloadTemplate}>
                                                Download Template
                                            </MenubarItem>
                                            <MenubarItem onClick={onResetTemplate}>
                                                Reset Template
                                            </MenubarItem>
                                            <MenubarItem onClick={() => onLocalSaveTemplate()}>
                                                Save Template
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
                                                    Generate Base PDF <input id="basetemp" type="file" accept="application/pdf" onChange={onChangeBasePDF} className="hidden" />
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
                    <PdfMenubar
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
        {/* <span style={{ margin: "0 1rem" }}>:</span>
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
        </select> */}
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
        <TooltipWrap trigger="Share Template">
                <Button variant="outline" size="icon" onClick={onOpen}>
                    <IoShareSocialOutline className="h-4 w-4" />
                </Button>
        </TooltipWrap>

        {/* input */}
        <TooltipWrap trigger="Share Template">
                <Button variant="outline" size="icon" onClick={onOpen}>
                    <IoShareSocialOutline className="h-4 w-4" />
                </Button>
        </TooltipWrap>
        <TooltipWrap trigger="Download Template">
                <Button variant="outline" size="icon" onClick={onDownloadTemplate}>
                    <MdDownload className="h-4 w-4" />
                </Button>
        </TooltipWrap>
        <TooltipWrap trigger="Save Template">
                <Button variant="outline" size="icon" onClick={() => onRemoteSaveTemplate()}>
                    <FaRegSave className="h-4 w-4" />
                </Button>
        </TooltipWrap>
        <TooltipWrap trigger="Delete Template">
                <Button variant="outline" size="icon" onClick={onResetTemplate}>
                    <MdDelete className="h-4 w-4" />
                </Button>
        </TooltipWrap>
        <TooltipWrap trigger="View PDF">
            <Button variant="outline" size="icon" onClick={() => generatePDF(User.current)}>
                <FaRegFileImage className="h-4 w-4" />
            </Button>
        </TooltipWrap>
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