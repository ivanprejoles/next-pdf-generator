'use client'

import { useEffect, useState } from "react";
import CreateStoreModal from "../modals/create-store-modal";
import AddStoreModal from "../modals/add-store-modal";

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
            <AddStoreModal />
        </>
    );
}
 
export default ModalProvider;