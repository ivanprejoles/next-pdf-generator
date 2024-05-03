'use client'

import { useEffect, useState } from "react";

import AddStoreModal from "../modals/add-store-modal";
import ReduxProvider from "./redux-provider";
import ShareLinkModal from "../modals/share-link-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (  
        <>
            <ReduxProvider>
                <AddStoreModal />
                <ShareLinkModal />
            </ReduxProvider>
        </>
    );
}
 
export default ModalProvider;