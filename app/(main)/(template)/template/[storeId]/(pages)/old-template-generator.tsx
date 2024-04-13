'use client'
import { useEffect, useRef, useState } from 'react';

import { cloneDeep, downloadJsonFile, getFontsData, getPlugins, getTemplate, getTemplateFromJsonFile, readFile } from '@/lib/helper';

import { Designer } from '@pdfme/ui';
import { Template ,checkTemplate } from '@pdfme/common';
import { generate } from '@pdfme/generator';

import JSZip from 'jszip';
import { read, utils} from 'xlsx'
import axios from 'axios';



const TemplateGenerator = ({
    params
}: {
    params: { storeId: string}
}) => {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);


    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        console.log(params)
        const fetchData = async () => {
            await axios.post(`/template/${params.storeId}`)
            .catch((error) => {
                console.log(error)
            }).then((response) => {
                console.log(response)
            })
        }
        let template: Template = getTemplate()
        try {
            fetchData()
            const templateString = localStorage.getItem('template')
            const templateJSON = templateString 
                ? JSON.parse(templateString)
                : getTemplate()
            checkTemplate(templateJSON)
            template = templateJSON as Template
        } catch (error) {
            localStorage.removeItem('template')            
        }

        getFontsData().then((font) => {
            if (designerRef.current) {
              designer.current = new Designer({
                domContainer: designerRef.current,
                template,
                options: { font },
                plugins: getPlugins(),
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

    const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
          readFile(e.target.files[0], "dataURL").then(async (basePdf) => {
            if (designer.current) {
              designer.current.updateTemplate(
                Object.assign(cloneDeep(designer.current.getTemplate()), {
                  basePdf,
                })
              );
            }
          });
        }
    };

    const onLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
          getTemplateFromJsonFile(e.target.files[0])
            .then((response: any) => {
              if (designer.current) {
                designer.current.updateTemplate(response);
              }
            })
            .catch((error: any) => {
              alert(`Invalid template file. ------------ ${error}`);
            });
        }
    };

    const onDownloadTemplate = () => {
        if (designer.current) {
            downloadJsonFile(designer.current.getTemplate(), 'template')
        }
    }

    //database onstore
    const onSaveTemplate = (template?: Template) => {
        if (designer.current) {
            localStorage.setItem(
                'template',
                JSON.stringify(template || designer.current.getTemplate())
            )
            alert('Saved!')
        }
    }

    const onResetTemplate = () => {
        if (designer.current) {
            designer.current.updateTemplate(getTemplate())
            localStorage.removeItem('template')
        }
    }

    const onGeneratePDF = async () => {
        if (designer.current) {
            const template = designer.current.getTemplate()
            const inputs = template.sampledata ?? []
            const font = await getFontsData()
            const pdf = await generate(
                {
                    template,
                    inputs,
                    plugins: getPlugins(),
                    options: { font }
                }
            )
            const blob = new Blob([pdf.buffer], { type: 'application/pdf'})
            window.open(URL.createObjectURL(blob))
        }
    }

    const onDownloadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0];
        if (!newFile) return;
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(newFile);
            reader.onload = async (event) => {
                if (!event.target?.result) {
                    console.log('Error reading file.');
                    return;
                }
                console.log(2)
        
                const workbook = read(event.target.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const dataArray = utils.sheet_to_json(worksheet);

                onDownloadPDFsByZip(dataArray)
            };
    
            reader.onerror = (error) => {
            console.error('Error reading file:', error);
            console.log('Error reading file.');
            };
        } catch (error) {
            
        }
    }
    
    const onDownloadPDFsByZip = async (data: any) => {
        if (designer.current) {
            const zip = new JSZip()

            for (let i:number = 0; i < data.length; i++) {
                const template = designer.current.getTemplate()
                const mergedObject: {[key:string]: string}[] = [referenceObject(template.sampledata?.[0], data[i])]
                console.log(template.sampledata)
                console.log(mergedObject)
                const inputs = mergedObject ?? []
                const font = await getFontsData()
                const pdf = await generate(
                    {
                        template,
                        inputs,
                        plugins: getPlugins(),
                        options: { font }
                    }
                )
                const blob = new Blob([pdf.buffer], { type: 'application/pdf'})
                const fileName = `generated-pdf-${i+1}.pdf`
                zip.file(fileName, blob)
            }

            try {
                const content = await zip.generateAsync({ type: 'blob' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'multiple-pdfs.zip';
                link.click();
            
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error creating ZIP archive:', error);
            }
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
                className='flex items-center justify-between'
            >
                <strong>Designer</strong>
                <span>:</span>
                <label style={{ width: 150 }}>
                    Change BasePDF
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={onChangeBasePDF}
                    />
                </label>
                <span style={{ margin: "0 1rem" }}>/</span>
                <label style={{ width: 150 }}>
                    Load Template
                    <input
                        type="file"
                        accept="application/json"
                        onChange={onLoadTemplate}
                    />
                </label>
                <span style={{ margin: "0 1rem" }}>/</span>
                <label style={{ width: 150 }}>
                    Load Data
                    <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={onDownloadCSV}
                    />
                </label>
                <span style={{ margin: "0 1rem" }}>/</span>
                <button onClick={onDownloadPDFsByZip}>Download PDFs</button>
                <span style={{ margin: "0 1rem" }}>/</span>
                <button onClick={onDownloadTemplate}>Download Template</button>
                <span style={{ margin: "0 1rem" }}>/</span>
                <button onClick={() => onSaveTemplate()}>Save Template</button>
                <span style={{ margin: "0 1rem" }}>/</span>
                <button onClick={onResetTemplate}>Reset Template</button>
                <span style={{ margin: "0 1rem" }}>/</span>
                <button onClick={onGeneratePDF}>Generate PDF</button>
            </header>
            <div ref={designerRef} />
        </div>
    );
}
 
export default TemplateGenerator;