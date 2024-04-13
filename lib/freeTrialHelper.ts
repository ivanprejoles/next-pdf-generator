import { Template, Font, checkTemplate } from '@pdfme/common';
import { Form, Viewer, Designer } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import {
  text,
} from '@pdfme/schemas';

const fontObjList = [
    {
      fallback: true,
      label: 'NotoSerifJP-Regular',
      url: '/fonts/NotoSerifJP-Regular.otf',
    },
    {
      fallback: false,
      label: 'NotoSansJP-Regular',
      url: '/fonts/NotoSansJP-Regular.otf',
    },
];

export const getFontsData = async () => {
    const fontDataList = await Promise.all(
      fontObjList.map(async (font) => ({
        ...font,
        data: await fetch(font.url).then((res) => res.arrayBuffer()),
      }))
    );
  
    return fontDataList.reduce((acc, font) => ({ ...acc, [font.label]: font }), {} as Font);
};

export const readFile = (file: File | null, type: 'text' | 'dataURL' | 'arrayBuffer') => {
    return new Promise<string | ArrayBuffer>((r) => {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
            if (e && e.target && e.target.result && file !== null) {
                r(e.target.result);
            }
        });
        if (file !== null) {
            if (type === 'text') {
                fileReader.readAsText(file);
            } else if (type === 'dataURL') {
                fileReader.readAsDataURL(file);
            } else if (type === 'arrayBuffer') {
                fileReader.readAsArrayBuffer(file);
            }
        }
    });
};

export const cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj));

export const getPlugins = () => {
    return {
      Text: text,
    };
};

export const generatePDF = async (currentRef: Designer | Form | Viewer | null) => {
  try {
    if (!currentRef) return;
    const template = currentRef.getTemplate();
    const inputs =
      typeof (currentRef as Viewer | Form).getInputs === 'function'
        ? (currentRef as Viewer | Form).getInputs()
        : template.sampledata ?? [];
    const font = await getFontsData();
  
    const pdf = await generate({
      template,
      inputs,
      options: { font, title: 'pdfGen' },
      plugins: getPlugins(),
    });
  
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  } catch (error) {
    console.error('[pdf gen] : only one page is allowed' )
  }
};

export const getTemplateContainer = (): Template => ({
    schemas: [
        {

        }
    ],
    basePdf: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UaXRsZSAobm9faXRlbSkKL1Byb2R1Y2VyIChTa2lhL1BERiBtMTI1IEdvb2dsZSBEb2NzIFJlbmRlcmVyKT4+CmVuZG9iagozIDAgb2JqCjw8L2NhIDEKL0JNIC9Ob3JtYWw+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggODQ+PiBzdHJlYW0KMSAwIDAgLTEgMCA3OTIgY20KcQouNzUgMCAwIC43NSAwIDAgY20KMSAxIDEgUkcgMSAxIDEgcmcKL0czIGdzCjAgMCA4MTYgMTA1NiByZQpmClEKCmVuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlCi9SZXNvdXJjZXMgPDwvUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0V4dEdTdGF0ZSA8PC9HMyAzIDAgUj4+Pj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCi9TdHJ1Y3RQYXJlbnRzIDAKL1BhcmVudCA1IDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFsyIDAgUl0+PgplbmRvYmoKNiAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyA1IDAgUgovVmlld2VyUHJlZmVyZW5jZXMgPDwvVHlwZSAvVmlld2VyUHJlZmVyZW5jZXMKL0Rpc3BsYXlEb2NUaXRsZSB0cnVlPj4+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKMDAwMDAwMDA5OCAwMDAwMCBuIAowMDAwMDAwMTM1IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKMDAwMDAwMDUxMCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNwovUm9vdCA2IDAgUgovSW5mbyAxIDAgUj4+CnN0YXJ0eHJlZgo2MjcKJSVFT0YK',
    sampledata: [
        {

        }
    ],
    columns: []
})