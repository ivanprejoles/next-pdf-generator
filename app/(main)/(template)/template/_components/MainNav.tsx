'use client'

import TemplateNavBar from "./template-navbar";
import ReduxProvider from "@/components/provider/redux-provider";

const MainNav = () => {
    return (  
        <ReduxProvider>
            <TemplateNavBar />
        </ReduxProvider>
    );
}
 
export default MainNav;