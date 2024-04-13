'use client'

import { useEffect, useRef, useState } from 'react';

import { cloneDeep, generatePDF, getFontsData, getPlugins, getTemplateContainer, readFile } from '@/lib/freeTrialHelper';

import { Designer } from '@pdfme/ui';
import { Template ,checkTemplate } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text } from '@pdfme/schemas';

import JSZip from 'jszip';
import DesignMenuButton from './DesignermenuButton';
import { DownloadIcon, File } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBasePDF } from '@/hooks/use-free-upload-pdf';

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
        setUse
    } = useBasePDF()
    
    const toastSuccess = (text: string) => {
        toast.success(text)
    }

    const toastError = (text: string) => {
        toast.error(text)
    }

    const toastWarning = (text:  string) => {
        toast.warning(text)
    }

    
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
        } catch (error) {
            toastError('template error')
            console.log(error)
        }

        getFontsData().then((font) => {
            if (designerRef.current) {
                designer.current = new Designer({
                    domContainer: designerRef.current,
                    template,
                    options: { font },
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
    }, [designerRef])

    const makeTemplate = () => {
        const newTemplate = Object.assign(cloneDeep(getTemplateContainer()), {
            pdfData
        })

        const schemas: any = {};
        const sampledata: any = {};

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
        }

        return newTemplate
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
                    setLoading(false)
                    toastSuccess('Pdf changed')
                });
            } else {
                console.log('[change base pdf warning] : no file')
                toastWarning('No Pdf detected')
            }
        } catch (error) {
            setLoading(false)
            toastError('base pdf error')
            console.error('[change base pdf error] : ', error)
        }
    };

    const onSaveTemplate = (template?: Template) => {
        if (designer.current) {
            localStorage.setItem(
                'template',
                JSON.stringify(template || designer.current.getTemplate())
            )
            alert('Saved!')
            toastSuccess(' template Saved')
        }
    }
    
    const onDownloadPDFsByZip = async () => {
        try {
            setLoading(true)
            toastId.current = toast.loading("Downloading by ZIP...", {
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
              });
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
                    const fileName = `generated-pdf-${i+1}.pdf`
                    zip.file(fileName, blob)
                }
                const content = await zip.generateAsync({ type: 'blob' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'multiple-pdfs.zip';
                link.click();
                URL.revokeObjectURL(link.href);
                setLoading(false)
                toast.dismiss(toastId.current);
                toastSuccess('pdf downloaded')
                onHide()
                setUse(false)
            } else {
                setLoading(false)
                toast.dismiss(toastId.current);
                toastWarning('no designer')
                console.warn('[designer warn] : no designer')
            }
        } catch (error) {
            setLoading(false)
            toast.dismiss(toastId.current);
            toastError('one base pdf only')
            console.error('[protection error] : only one page is allowed')
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
                className='flex items-center justify-between p-3'
            >
                <DesignMenuButton 
                    title='base pdf'
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
                    ButtonIcon={File}
                    isLoading={loading}
                />
                <DesignMenuButton 
                    title='download pdf'
                    onClick={() => onDownloadPDFsByZip()}
                    ButtonIcon={DownloadIcon}
                    isLoading={loading}
                />
                <DesignMenuButton 
                    title='generate pdf'
                    onClick={() => generatePDF(designer.current)}
                    ButtonIcon={File}
                    isLoading={loading}
                />
            </header>
            <div ref={designerRef} />
        </div>
    );
}
 
export default FreeTemplateGenerator;