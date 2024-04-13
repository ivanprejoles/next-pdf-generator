'use client'

import React, { useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { Designer, Form, Viewer } from "@pdfme/ui";
import {
  getFontsData,
  getTemplate,
  handleLoadTemplate,
  generatePDF,
  getPlugins,
  isJsonString,
} from "@/lib/helper";
import { FormViewNavbar } from "./_components/navbar-formview";
import { useRouter } from "next/navigation";

const headerHeight = 65;

type Mode = "form" | "viewer" | 'design';

const initTemplate = () => {
  let template: Template = getTemplate();
  try {
    const templateString = localStorage.getItem("template");
    const templateJson = templateString
      ? JSON.parse(templateString)
      : getTemplate();
    checkTemplate(templateJson);
    template = templateJson as Template;
  } catch {
    localStorage.removeItem("template");
  }
  return template;
};

function App({
  params
}: {
  params : { storeId: string}
}) {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const ui = useRef<Form | Viewer | null>(null);
  const [prevUiRef, setPrevUiRef] = useState<Form | Viewer | null>(null);

  const Router = useRouter()

  const [mode, setMode] = useState<Mode>(
    (localStorage.getItem("mode") as Mode) ?? "form"
  );

  const buildUi = (mode: Mode) => {
    const template = initTemplate();
    let inputs = template.sampledata ?? [{}];
    try {
      const inputsString = localStorage.getItem("inputs");
      const inputsJson = inputsString
        ? JSON.parse(inputsString)
        : template.sampledata ?? [{}];
      inputs = inputsJson;
    } catch {
      localStorage.removeItem("inputs");
    }

    getFontsData().then((font) => {
      if (uiRef.current) {
        ui.current = new (mode === "form" ? Form : Viewer)({
          domContainer: uiRef.current,
          template,
          inputs,
          options: {
            font,
            labels: { 'clear': 'clear' },
            theme: {
              token: {
                colorPrimary: '#25c2a0',
              },
            },
          },
          plugins: getPlugins(),
        });
      }
    });
  };

  const onChangeMode = (type: Mode) => {
    const value = type as Mode;
    console.log('form view')
    console.log(value)
    if (value === 'design') {
      localStorage.setItem('mode', value)
      return Router.replace(`/template/${params.storeId}/designer`)
    }
    setMode(value);
    localStorage.setItem("mode", value);
    buildUi(value);
  };

  const onGetInputs = () => {
    if (ui.current) {
      const inputs = ui.current.getInputs();
      alert(JSON.stringify(inputs, null, 2));
      alert("Dumped as console.log");
      console.log(inputs);
    }
  };

  const onSetInputs = () => {
    if (ui.current) {
      const prompt = window.prompt("Enter Inputs JSONString") || "";
      try {
        const json = isJsonString(prompt) ? JSON.parse(prompt) : [{}];
        ui.current.setInputs(json);
      } catch (e) {
        alert(e);
      }
    }
  };

  const onSaveInputs = () => {
    if (ui.current) {
      const inputs = ui.current.getInputs();
      localStorage.setItem("inputs", JSON.stringify(inputs));
      alert("Saved!");
    }
  };

  const onResetInputs = () => {
    localStorage.removeItem("inputs");
    if (ui.current) {
      const template = initTemplate();
      ui.current.setInputs(template.sampledata ?? [{}]);
    }
  };

  if (uiRef != prevUiRef) {
    if (prevUiRef && ui.current) {
      ui.current.destroy();
    }
    buildUi(mode);
    setPrevUiRef(uiRef);
  }
  
  return (
    <div className="w-full h-auto ">
      <FormViewNavbar
        mode={mode}
        onChangeMode={onChangeMode}
        onLoadTemplate={(e: React.ChangeEvent<HTMLInputElement>) => handleLoadTemplate(e, ui.current)}
        onGeneratePDF={() =>generatePDF(ui.current)}
      />
        {/* <span style={{ margin: "0 1rem" }}>:</span>
        <div>
          <input type="radio" onChange={onChangeMode} id="form" value="form" checked={mode === "form"} />
          <label htmlFor="form">Form</label>
          <input type="radio" onChange={onChangeMode} id="viewer" value="viewer" checked={mode === "viewer"} />
          <label htmlFor="viewer">Viewer</label>
        </div>
        <label style={{ width: 180 }}>
          Load Template
          <input type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, ui.current)} />
        </label>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onGetInputs}>Get Inputs</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onSetInputs}>Set Inputs</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onSaveInputs}>Save Inputs</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={onResetInputs}>Reset Inputs</button>
        <span style={{ margin: "0 1rem" }}>/</span>
        <button onClick={() => generatePDF(ui.current)}>Generate PDF</button> */}
      {/* </header> */}
      <div ref={uiRef} className="pt-[56px]" style={{ width: '100%', height: `calc(100vh - ${headerHeight}px)` }} />
    </div>
  );
}

export default App;
