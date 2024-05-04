'use client'

import { useEffect, useRef, useState } from 'react';

import { generatePDF, getFontsData, getPlugins, getTemplate } from '@/lib/helper';

import { Form } from '@pdfme/ui';
import { Template ,checkTemplate } from '@pdfme/common';
import { generate } from '@pdfme/generator';

import JSZip from 'jszip';
import { FaRegFileImage} from 'react-icons/fa6'
import { useBasePDF } from  '@/hooks/use-free-upload-pdf';
import { cn } from '@/lib/utils';
import { read, utils } from 'xlsx';
import TooltipWrap from '@/components/tool-tip-wrapper';
import { Button } from '@/components/ui/button';
import { CiViewTable } from 'react-icons/ci';
import { toastDismiss, toastError, toastLoading, toastSuccess, toastWarning } from '@/lib/toast-method';
import delayFunction from '@/lib/delayMethod';

interface ShareTemp {
    sharedData: any
}

const headerHeight = 100;

const ShareTemplateGenerator = ({
    sharedData
}: ShareTemp) => {
    const UserRef = useRef<HTMLDivElement | null>(null);
    const User = useRef<Form | null>(null);
    const toastId = useRef<any>(null)
    const hiddenLoadCSV = useRef<HTMLInputElement>(null)
    
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    const {
        data,
        setUse,
    } = useBasePDF()
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        let template: Template = getTemplate()
        try {
            template = JSON.parse(sharedData) as Template
            checkTemplate(template)

            getFontsData().then((font) => {
                let inputs = template.sampledata ?? [{}];
                if (UserRef.current) {
                    User.current = new Form({
                        domContainer: UserRef.current,
                        template,
                        inputs,
                        options: { 
                            font,
                            theme: {
                                token: {}
                            }
                        },
                        plugins: getPlugins()
                    });
    
                }
            });

            return () => {
                if (User.current) {
                    User.current.destroy();
                }
            };

        } catch (error) {
            toastError('Error Initializing Template')
            console.error('[Template-Init. Error] : ', error)
        }
        
    }, [UserRef, sharedData])

    const onDownloadPDFsByZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true)
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
                        setUse(false)
                    } else {
                        toastDismiss(toastId.current);
                        toastWarning('Missing Template')
                        console.warn('[Missing Template] : Missing template. Try to refresh')
                    }
                }
                reader.onerror = async () => {
                    toastDismiss(toastId.current);
                    setLoading(false)
                    console.error('[Protection Error] : Currently supports single-page PDFs')
                    toastError('Currently supports single-page PDFs')
                    await delayFunction(500)
                    toastWarning("For urgent multiple page use, copy-paste the content from page 1 to another page. Be sure to remove the 'copy' prefix from the field names so they reference the original fields.")
                    await delayFunction(500)
                    toastWarning('If it does not work, your pdf is probably encrypted. ')
                    return
                }
            }
        } catch (error) {
            toastDismiss(toastId.current);
            toastError('Currently supports single-page PDFs')
            toastWarning('For urgent 2-page use, copy-paste single input from page 1 to page 2')
            console.error('[Protection Error] : Currently supports single-page PDFs')
        } finally {
            setLoading(false)
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

    if (!isMounted) {
        return null
    }
    
    const loadCSVClick = () => {
        hiddenLoadCSV.current?.click()
    }
    
    return (  
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow w-full">
            <header className="z-50 w-full flex justify-end p-2 items-center border-b">
                <div className="ml-auto flex w-full space-x-2 justify-end">
                    <TooltipWrap trigger="CSV to PDFs" >
                            <Button variant="playground" size="icon" onClick={loadCSVClick} disabled={loading}>
                                <CiViewTable className="h-4 w-4" />
                                <input 
                                    ref={hiddenLoadCSV} 
                                    type="file" 
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={onDownloadPDFsByZip}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </Button>
                    </TooltipWrap>
                    <TooltipWrap trigger="View PDF">
                        <Button variant="playground" disabled={loading} size="icon" onClick={() => generatePDF(User.current)}>
                            <FaRegFileImage className="h-4 w-4" />
                        </Button>
                    </TooltipWrap>
                </div>
            </header>
            <div 
                ref={UserRef}
                style={{ width: '100%', height: `calc(97vh - ${headerHeight}px)` }} 
                className={cn(
                    "bg-black z-[20]  overflow-hidden justify-center flex"
                )}
            />
        </div>
    );
}
 
export default ShareTemplateGenerator;