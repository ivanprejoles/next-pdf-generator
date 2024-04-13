'use client'

import { useRef, useState } from "react";
import { Template, checkTemplate, Lang} from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import {
  getFontsData,
  getTemplate,
  readFile,
  cloneDeep,
  getPlugins,
  handleLoadTemplate,
  generatePDF,
  downloadJsonFile,
} from "@/lib/helper";
import { FormViewNavbar } from "../formView/_components/navbar-formview";
import { useRouter } from "next/navigation";

const headerHeight = 65;

type Mode = "form" | "viewer" | 'design';

function App({
  params
}: {
  params: { storeId: string}
}) {
  const designerRef = useRef<HTMLDivElement | null>(null); //2
  const designer = useRef<Designer | null>(null); //1
  const [lang, setLang] = useState<Lang>('en'); //0
  const [prevDesignerRef, setPrevDesignerRef] = useState<Designer | null>(null); //1
  
  const Router = useRouter()
  
  const [mode, setMode] = useState<Mode>(
    (localStorage.getItem("mode") as Mode) ?? "design"
  );

  const buildDesigner = () => {
    let template: Template = getTemplate(); //2
    try {
      const templateString = localStorage.getItem("template");
      const templateJson = templateString
        ? JSON.parse(templateString)
        : getTemplate();
      checkTemplate(templateJson);
      template = templateJson as Template;
    } catch {
      localStorage.removeItem("template");
    } //2

    getFontsData().then((font) => {
      if (designerRef.current) {
        designer.current = new Designer({
          domContainer: designerRef.current,
          template,
          options: {
            font,
            lang,
            labels: {
              addNewField: 'pdfme!', // Update existing labels
              'clear': '🗑️', // Add custom labels to consume them in your own plugins
            },
            theme: {
              token: {
                colorPrimary: '#25c2a0',
              },
            },
          },
          plugins: getPlugins(),
        });
        designer.current.onSaveTemplate(onSaveTemplate);
      }
    }); //1
  }

  const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('receive change')
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
  }; //0

  const onDownloadTemplate = () => {
    if (designer.current) {
      downloadJsonFile(designer.current.getTemplate(), "template");
      console.log(designer.current.getTemplate());
    }
  }; //0

  const onSaveTemplate = (template?: Template) => {
    if (designer.current) {
      localStorage.setItem(
        "template",
        JSON.stringify(template || designer.current.getTemplate())
      );
      alert("Saved!");
    }
  }; // 0

  const onResetTemplate = () => {
    if (designer.current) {
      designer.current.updateTemplate(getTemplate());
      localStorage.removeItem("template");
    }
  }; //0

  const onChangeMode = (type: Mode) => {
    const value = type as Mode;
    console.log('design')
    console.log(value)
    if (value !== 'design') {
      localStorage.setItem('mode', value)
      return Router.replace(`/template/${params.storeId}/formView`)
    }
  }

  if (designerRef != prevDesignerRef) {
    if (prevDesignerRef && designer.current) {
      designer.current.destroy();
    }
    buildDesigner();
    setPrevDesignerRef(designerRef);
  } //1
  return (
    <div className="w-full h-auto">
      <FormViewNavbar
        mode={mode}
        onChangeMode={onChangeMode}
        onGeneratePDF={() => generatePDF(designer.current)}
        onChangeBase={(e: React.ChangeEvent<HTMLInputElement>) => onChangeBasePDF(e)}
        onLoadTemplate={(e: React.ChangeEvent<HTMLInputElement>) => handleLoadTemplate(e, designer.current)}
        onDownloadTemplate={onDownloadTemplate}
        onResetTemplate={onResetTemplate}
        onLangChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setLang(e.target.value as Lang)
          if (designer.current) {
            designer.current.updateOptions({ lang: e.target.value as Lang })
          }
        }}
        lang={lang}
      />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginRight: 120, }}>
        <strong>Designer</strong>
        <span style={{ margin: "0 1rem" }}>:</span>
        <select onChange={(e) => {
          setLang(e.target.value as Lang)
          if (designer.current) {
            designer.current.updateOptions({ lang: e.target.value as Lang })
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
          <input type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, designer.current)} />
        </label>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onDownloadTemplate}>Download Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={() => onSaveTemplate()}>Save Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onResetTemplate}>Reset Template</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={() => generatePDF(designer.current)}>Generate PDF</button>
      </header>
      <div ref={designerRef} style={{ width: '100%', height: `calc(100vh - ${headerHeight}px)` }} />
    </div>
  );
}

export default App;
