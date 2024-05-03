'use client'

import ReduxProvider from "@/components/provider/redux-provider";
import PdfGenerator from "./pdf-generator";

const WrappedPDFGen = () => {
    return (
        <ReduxProvider>
            <PdfGenerator />
        </ReduxProvider>
    );
}
 
export default WrappedPDFGen;