'use client'

import { WavyBackground } from "@/components/ui/wavy-background";
import { useEffect, useState } from "react";

const HydrationWrapper = ({children} : {children: React.ReactNode}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        null
    }
    
    return (  
        <WavyBackground className="mx-auto flex items-center justify-center">
            {children}
        </WavyBackground>
    );
}
 
export default HydrationWrapper;