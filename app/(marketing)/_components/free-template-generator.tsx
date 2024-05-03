'use client'

import JSZip from 'jszip';
import { useEffect, useRef, useState } from 'react';

import { FaFilePdf, FaFileArrowDown, FaFileImage} from 'react-icons/fa6'

import { text } from '@pdfme/schemas';
import { Designer } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import { Template ,checkTemplate } from '@pdfme/common';
import { cloneDeep, generatePDF, getFontsData, getTemplateContainer, readFile } from '@/lib/freeTrialHelper';

import DesignMenuButton from './DesignermenuButton';

import { cn } from '@/lib/utils';
import { useBasePDF } from '@/hooks/use-free-upload-pdf';
import {toastError, toastWarning, toastLoading, toastSuccess, toastDismiss} from '@/lib/toast-method'
import delayFunction from '@/lib/delayMethod';

const headerHeight = 65;

interface TemplateGeneratorInterface {
    onHide: () => void,
    csvData: any[],
    pdfData: string | ArrayBuffer | null,
    csvHeader: string[],
}

const FreeTemplateGenerator = ({
    onHide,
    csvData,
    pdfData,
    csvHeader
}: TemplateGeneratorInterface) => {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);
    const toastId = useRef<any>(null)
    
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
        let template: Template = getTemplateContainer()
        try {
            template = template as Template
            const newTemplate = makeTemplate()
            checkTemplate(newTemplate)
            template = newTemplate as Template

            getFontsData().then((font) => {
                if (designerRef.current) {
                    designer.current = new Designer({
                        domContainer: designerRef.current,
                        template,
                        options: { 
                            font, 
                            theme: {
                                token: {
                                    colorTextLightSolid: 'black',
                                },
                            },
                        },
                        plugins: {
                            text,
                        },
                    });
                    designer.current.onSaveTemplate(onSaveTemplate);
                }
            });

            return () => {
                if (designer.current) {
                    designer.current.destroy();
                }
            };

        } catch (error) {
            toastError('Error Initializing Template')
            console.error('[Template-Init. Error] : ', error)
        }

    }, [designerRef])

    const makeTemplate = () => {
        try {
            const schemas: any = {};
            const sampledata: any = {};

            const newTemplate = Object.assign(cloneDeep(getTemplateContainer()), {
                pdfData
            })
            
            csvHeader.forEach((key: string, index: number) => {
                schemas[key] = {
                    type: 'text',
                    position: {
                        x:((index % 5) * 30 + 10),
                        y:((Math.floor(index / 5) * 10 + 5)),
                    },
                    width: 30,
                    height: 10,
                    rotate: 0,
                    opacity: 1,
                    fontSize: 9,
                    font: 'NotoSerifJP-Regular'
                }
    
                sampledata[key] = key
    
            })

            newTemplate.schemas = [schemas]
            newTemplate.columns = csvHeader as string[]
            newTemplate.sampledata = [sampledata]

            if ( data && data.length > 0) {
                newTemplate.basePdf = data
            } else {
                newTemplate.basePdf = pdfData
            }
    
            return newTemplate

        } catch (error) {
            toastError('Error Building Template')
            console.error('[Template-Making Error] : ', error)
        }
    }
    
    const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target && e.target.files) {
                setLoading(true)
                readFile(e.target.files[0], "dataURL").then(async (basePdf) => {
                    if (designer.current) {
                        designer.current.updateTemplate(
                            Object.assign(cloneDeep(designer.current.getTemplate()), {
                                basePdf,
                            })
                        );
                    }
                    toastSuccess('Pdf changed')
                });
            } else {
                toastWarning('No PDF Detected')
                console.warn('[Base PDF Warning] : no File')
            }
        } catch (error) {
            toastError('Error Replacing New Base PDF')
            console.error('[BasePDf-Replacing Error] : ', error)
        } finally {
            setLoading(false)
        }
    };

    const onSaveTemplate = (template?: Template) => {
        if (designer.current) {
            localStorage.setItem(
                'template',
                JSON.stringify(template || designer.current.getTemplate())
            )
            toastSuccess('Template Generation Complete.')
        }
    }
    //this method (useful for main pdf-generator to get uploaded csv header) - #csvtopdf
    const onDownloadPDFsByZip = async () => {
        try {
            setLoading(true)
            toastWarning("WARNING! DOWNLOADING IN PROGRESS. DO NOT CANCEL.")
            toastId.current = toastLoading("Downloading to ZIP...");
            
            const data = csvData;

            if (designer.current) {
                const zip = new JSZip()
                for (let i:number = 0; i < data.length; i++) {
                    const template = designer.current.getTemplate()
                    const mergedObject: {[key:string]: string}[] = [referenceObject(template.sampledata?.[0], data[i])]
                    const inputs = mergedObject ?? []
                    const font = await getFontsData()
                    const pdf = await generate({
                        template,
                        inputs,
                        plugins: { text },
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
                toastSuccess('PDF Downloaded Successfully')
                onHide()
                setUse(false)
            } else {
                toastDismiss(toastId.current)
                toastWarning('Missing Template')
                console.warn('[Missing Template] : Missing template. Try to refresh')
            }
        } catch (error) {
            toastDismiss(toastId.current);
            console.error('[Protection Error] : Currently supports single-page PDFs')
            toastError('Currently supports single-page PDFs')
            await delayFunction(1000)
            toastWarning('For urgent 2-page use, copy-paste single input from page 1 to page 2')
            await delayFunction(1000)
            toastWarning('If it does not work, your pdf is probably encrypted')
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
    
    return (  
        <div>
            <header
                className='h-full w-full flex items-center justify-between p-3'
            >
                <DesignMenuButton 
                    title='Change Template'
                    onClick={() => {document.getElementById('basePdfInput')?.click()}}
                    inputs={(
                        <input
                            id='basePdfInput'
                            type="file"
                            accept="application/pdf"
                            onChange={onChangeBasePDF}
                            className="hidden"
                        />
                    )}
                    ButtonIcon={FaFilePdf}
                    isLoading={loading}
                />
                <DesignMenuButton 
                    title='Download Pdfs'
                    onClick={() => onDownloadPDFsByZip()}
                    ButtonIcon={FaFileArrowDown}
                    isLoading={loading}
                />
                <DesignMenuButton 
                    title='View Mode'
                    onClick={() => generatePDF(designer.current)}
                    ButtonIcon={FaFileImage}
                    isLoading={loading}
                />
            </header>
            <div 
                ref={designerRef}
                style={{ width: '100%', height: `calc(97vh - ${headerHeight}px)` }} 
                className={cn(
                    "rounded-l-[22px] z-[20] rounded-r-[22px] overflow-hidden"
                )}
            />
        </div>
    );
}
 
export default FreeTemplateGenerator;