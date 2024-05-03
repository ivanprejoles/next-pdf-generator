'use client'

import { cloneDeep, downloadJsonFile, generatePDF, getFontsData, getPlugins, getTemplate, handleLoadTemplate, readFile } from "@/lib/helper";
import { Lang, Template, checkTemplate } from "@pdfme/common";
import { Designer, Form, Viewer } from "@pdfme/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PdfMenubar } from "./pdf-menubar";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { cn } from "@/lib/utils";
import axios from "axios";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { addTemplate, removeTemplate } from "@/lib/reduxFeatures/templateslice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useShareModal } from "@/hooks/use-share-link-modal";
import { Button } from "@/components/ui/button";
import { FaRegFileImage } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { LuFileEdit } from "react-icons/lu";
import { MdDelete, MdDownload } from "react-icons/md";
import { GoKebabHorizontal } from "react-icons/go";
import { TbFileDownload, TbFileUpload } from "react-icons/tb";
import TooltipWrap from "@/components/tool-tip-wrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CiViewTable } from "react-icons/ci";
import { toastDismiss, toastError, toastLoading, toastSuccess, toastWarning } from "@/lib/toast-method";
import delayFunction from "@/lib/delayMethod";
import { read, utils } from "xlsx";
import JSZip from "jszip";
import { generate } from "@pdfme/generator";

const headerHeight = 100;

type Mode = "form" | "viewer" | 'design';

const PdfGenerator = () => {
    const dispatch = useAppDispatch()
    const reduxTemplate = useAppSelector((state: any) => state.userTemplate.value.templates)
    const {storeId} = useParams<{storeId: string}>()
    const {
        onOpen
    } = useShareModal()

    const UserRef = useRef<HTMLDivElement | null>(null);
    const User = useRef<Viewer | Form | Designer | null>(null); 
    const hiddenBasePdf = useRef<HTMLInputElement>(null)
    const hiddenLoadTemplate = useRef<HTMLInputElement>(null)
    const hiddenLoadCSV = useRef<HTMLInputElement>(null)
    const toastId = useRef<any>(null)
    // const hiddenLoadSheetHeader = useRef<HTMLInputElement>(null)
    // const hiddenLoadSheetData = useRef<HTMLInputElement>(null)

    const [isRequesting, setIsRequesting] = useState(false)
    const [mode, setMode] = useState<Mode>(
        (localStorage.getItem('mode') as Mode ?? 'design')
    )
    const [loading, setLoading] = useState(false);
    
    let fetching = useRef(true);

    // add auto same such as settimeout
    // add checkbox
    
    useEffect(() => {
        let template: Template = getTemplate()

        const fetchData = async () => {
            await axios.post(`/api/template/${storeId}`, {emptyTemplate: JSON.stringify(template)})
            .then((response) => {
                dispatch(addTemplate({key: storeId, value: JSON.parse(response?.data.templateData)}))
            })
            .catch((error) => {
                toastError('We encountered an error loading your data. Please check your network connection and try again.')
                console.error('[Load Data] : cannot load the data')
            })
            .finally(() => {
                fetching.current = true
                toastDismiss(toastId.current);  
            })
        }

        if (!reduxTemplate[storeId]) {
            if (fetching.current) {
                fetching.current = false
                toastId.current = toastLoading('Preparing your data...')
                fetchData()
            }
        } else {
            try {
                if (reduxTemplate[storeId]) {
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
                                            colorTextLightSolid: 'black',
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
                                        },
                                    },
                                    plugins: getPlugins(),
                                })
                            } 
                            const child = UserRef.current?.children[0] as HTMLElement
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
                toastError('Error Building Template')
                console.error('[Template-Making Error] : ', error)
                reduxTemplate[storeId]
            }
        }
    }, [ mode, storeId, reduxTemplate ])
        
    const onChangeMode = (type: Mode) => {
        const value = type as Mode;
        if (mode === 'design') {
            onLocalSaveTemplate()
        }
        setMode(value)
        localStorage.setItem('mode', value)
    }

    const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
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
            }
        } catch (error) {
            toastError('Error Replacing New Base PDF')
            console.error('[BasePDf-Replacing Error] : ', error)
        }
    }

    const onDownloadTemplate = () => {
        if (User.current && mode === 'design') {
          downloadJsonFile(User.current.getTemplate(), `template`);
        }
      };

    const onLocalSaveTemplate = () => {
        try {
            if (User.current && mode === 'design') {
                dispatch(addTemplate({key: storeId, value: User.current.getTemplate()}))
            }
        } catch (error) {
            console.error('[Local Save] : ',error)
        }
    }

    const onRemoteSaveTemplate = async () => {
        if (User.current && reduxTemplate[storeId] && mode === 'design') {
            const userTemplate = User.current.getTemplate()
            await axios.patch(`/api/template/${storeId}`, {templateData: JSON.stringify(userTemplate)})
            .then((response: any) => {
                if (response.status === 200 && reduxTemplate[storeId] !== userTemplate) {
                    onLocalSaveTemplate()
                    toastSuccess('Template Saved')
                }
            })
            .catch((error) => {
                toastError('We encountered an error saving your template. Please check your network connection and try again.')
                console.error('[Save Template] : cannot save your template')
            })
            .finally( async () => {
                await delayFunction(2000)
                setIsRequesting(false)
            })
        }
    }

    const onResetTemplate = async () => {
        if (User.current && mode === 'design' && !isRequesting) {
            setIsRequesting(true)
            
            let confirmationText = 'Deleting this template is permanent. Confirm?'
            if (confirm(confirmationText) === false) {
                return
            }
            let blankTemplate = getTemplate()
            await axios.patch(`/api/template/${storeId}`, {templateData: JSON.stringify(blankTemplate)})
            .then((response: any) => {
                if (response.status === 200 && reduxTemplate[storeId]) {
                    dispatch(addTemplate({key: storeId, value: blankTemplate}))
                    toastSuccess('Template Reset')
                }
            })
            .catch(() => {
                toastError('We encountered an error resetting your template. Please check your network connection and try again.')
                console.error('[Reset Template] : cannot reset your template')
            })
            .finally( async () => {
                await delayFunction(2000)
                setIsRequesting(false)
            }) 
        }
    }

    const onDownloadPDFsByZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsRequesting(true)
            toastWarning("WARNING! DOWNLOADING IN PROGRESS. DO NOT CANCEL.")
            toastId.current = toastLoading("Downloading to ZIP...");
            const newFile = event.target.files?.[0]
            if (!newFile) {
                return
            }

            if (event.target && event.target.files && event.target.files[0]) {
                const reader = new FileReader()
                reader.readAsArrayBuffer(newFile)
                reader.onload = async (event) => {
                    if (!event.target?.result) {
                        return
                    }

                    const workbook = read(event.target.result, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const dataArray = utils.sheet_to_json(worksheet);

                    const keys = Object.keys(dataArray[0] as {});
                    const zip = new JSZip()
                    if (User.current) {

                        const template = User.current?.getTemplate()
                        for (let i:number = 0; i < dataArray.length; i++) {
                            const mergedObject: {[key:string]: string}[] = [referenceObject(template.sampledata?.[0], dataArray[i])]
                            const inputs = mergedObject ?? []
                            const font = await getFontsData()
                            const pdf = await generate({
                                template,
                                inputs,
                                plugins: getPlugins(),
                                options: { font }
                            })
                            const blob = new Blob([pdf.buffer], { type: 'application/pdf'})
                            const fileName = `Generated-PDf ${i+1}.pdf`

                            zip.file(fileName, blob)
                        }
                        
                        const content = await zip.generateAsync({ type: 'blob' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = 'Multiple PDF';
                        link.click();

                        URL.revokeObjectURL(link.href);
                        toastDismiss(toastId.current);
                        toastSuccess('pdf downloaded')
                    } else {
                        toastDismiss(toastId.current);
                        toastWarning('Missing Template')
                        console.warn('[Missing Template] : Missing template. Try to refresh')
                    }
                }
                reader.onerror = (error) => {
                    toastDismiss(toastId.current);
                    toastError('Currently supports single-page PDFs')
                    toastWarning('For urgent 2-page use, copy-paste single input from page 1 to page 2')
                    console.error('[Protection Error] : Currently supports single-page PDFs')
                    setIsRequesting(false)
                    return
                }
            }
        } catch (error) {
            toastDismiss(toastId.current);
            toastError('Currently supports single-page PDFs')
            toastWarning('For urgent 2-page use, copy-paste single input from page 1 to page 2')
            console.error('[Protection Error] : Currently supports single-page PDFs')
        } finally {
            setIsRequesting(false)
        }
    }

    const referenceObject = (referenceObject: any, otherObject: any): {[key: string]: string} => {
        const mergedObject: any = {};

        for (const key in referenceObject) {
            if (Object.prototype.hasOwnProperty.call(referenceObject, key)) {
                if (key in otherObject && otherObject[key] !== '') {
                    mergedObject[key] = String(otherObject[key]);
                } else {
                    mergedObject[key] = String(referenceObject[key]);
                }
            }
        }

        return mergedObject;
    }

    const loadTemplateClick = () => {
        hiddenLoadTemplate.current?.click()
    }

    const changeBaseClick = () => {
        hiddenBasePdf.current?.click()
    }

    const loadCSVClick = () => {
        hiddenLoadCSV.current?.click()
    }
    // const loadSheetHeaderClick = () => {
    //     hiddenLoadSheetHeader.current?.click()
    // }
    
    return (  
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow w-full">
            <header className="z-50 w-full flex justify-between p-2 items-center border-b overflow-x-auto">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger disabled={isRequesting} className="p-[5px]">
                            {mode}
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value={mode} >
                                <MenubarRadioItem onClick={() => {onChangeMode('design')}} value="design">Design</MenubarRadioItem>
                                <MenubarRadioItem onClick={() => {onChangeMode('form')}} value="form">Form</MenubarRadioItem>
                                <MenubarRadioItem onClick={() => {onChangeMode('viewer')}} value="viewer">View</MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <div className="ml-auto flex w-full space-x-2 sm:justify-end overflow-x-auto">
                    {mode === 'design' && (
                        <>  
                            <TooltipWrap trigger="Save Template">
                                <Button variant="playground" size="icon" onClick={() => onRemoteSaveTemplate()} disabled={isRequesting} >
                                    <FaRegSave className="h-4 w-4" />
                                </Button>
                            </TooltipWrap>
                            <TooltipWrap trigger="Change Base PDF" >
                                <Button variant="playground" size="icon" onClick={changeBaseClick} disabled={isRequesting}>
                                    <LuFileEdit className="h-4 w-4" />
                                    <input 
                                        ref={hiddenBasePdf} 
                                        type="file" 
                                        accept="application/pdf" 
                                        onChange={onChangeBasePDF}
                                        className="hidden" 
                                        disabled={isRequesting}
                                    />
                                </Button>
                            </TooltipWrap>
                        </>
                    )}
                    <TooltipWrap trigger="CSV to PDFs" >
                            <Button variant="playground" disabled={isRequesting} size="icon" onClick={loadCSVClick}>
                                <CiViewTable className="h-4 w-4" />
                                <input 
                                    ref={hiddenLoadCSV} 
                                    type="file" 
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={onDownloadPDFsByZip}
                                    className="hidden"
                                    disabled={isRequesting}
                                />
                            </Button>
                    </TooltipWrap>
                    <TooltipWrap trigger="Share Template">
                        <Button variant="playground" size="icon" onClick={onOpen}>
                            <IoShareSocialOutline className="h-4 w-4" />
                        </Button>
                    </TooltipWrap>
                    <TooltipWrap trigger="Upload Template" >
                        <Button variant="playground" size="icon" onClick={loadTemplateClick} disabled={isRequesting}>
                            <TbFileUpload className="h-4 w-4" />
                            <input 
                                ref={hiddenLoadTemplate} 
                                type="file" 
                                accept="application/json" 
                                onChange={(e) => handleLoadTemplate(e, User.current)} 
                                className="hidden"
                                disabled={isRequesting}
                            />
                        </Button>
                    </TooltipWrap>
                    <TooltipWrap trigger="Download Template">
                        <Button variant="playground" size="icon" onClick={onDownloadTemplate} disabled={isRequesting}>
                            <TbFileDownload className="h-4 w-4" />
                        </Button>
                    </TooltipWrap>
                    <TooltipWrap trigger="View PDF">
                        <Button variant="playground" size="icon" onClick={() => generatePDF(User.current)}>
                            <FaRegFileImage className="h-4 w-4" />
                        </Button>
                    </TooltipWrap>
                    <DropdownMenu>
                        <TooltipWrap trigger="Private Menu">
                            <DropdownMenuTrigger asChild disabled={isRequesting}>
                                <Button variant="playground" size="icon" disabled={isRequesting}>
                                    <GoKebabHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipWrap>
                        <DropdownMenuContent className="w-30" side="bottom">
                            <DropdownMenuLabel>Private Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={onResetTemplate} disabled={isRequesting}>
                                    <MdDelete className="h-4 w-4 mr-2 text-red-500" />
                                    <span className="text-red-500">Reset Template</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div 
                ref={UserRef} 
                style={{ width: '100%', height: `calc(97vh - ${headerHeight}px)` }} 
                className={cn(
                    "overflow-hidden bg-transparent z-[20]",
                )}
            />
        </div>
    );
}
 

export default PdfGenerator;