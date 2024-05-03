'use client'

import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

import { ModeToggle } from "./mode-toggle";
import StoreSwitcher from "@/components/store-switcher";

import {addSwitchers} from '@/lib/reduxFeatures/templateslice'
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toastError, toastWarning } from "@/lib/toast-method";

type SwitcherType = {
    [key: string]: {label: string, value: string, shareCode: string}
}

const TemplateNavBar = () => {

    const template = useAppSelector((state: any) => state.userTemplate)
    const dispatch = useAppDispatch()
    useEffect(() => {
        const fetchData = async () => {
            await axios.post('/api/stores')
            .catch(() => {
                toastError('We encountered an error getting the data. Please check your network connection and try again.')
                console.error('[Data Fetching] : cannot get your data')
            })
            .then((response) => {
                if (response?.data && response.data.length > 0) {
                    const switcherObject: SwitcherType = {}

                    response.data.forEach((data: any) => {
                        switcherObject[data.id] = {
                            label: data.name,
                            value: data.id,
                            shareCode: data.shareCode
                        }
                    });

                    dispatch(addSwitchers(switcherObject))
                } else {
                    toastWarning('No Data')
                }
            })
        }

        fetchData()
    }, [])
    
    return (  
        <div className="w-full fixed flex flex-row justify-between items-center p-2 h-[56px] shadow-sm z-50 bg-white dark:bg-background text-black dark:text-white">
            <StoreSwitcher />
            <div>{template.switcher}</div>
            <div className="flex flex-row items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}
 
export default TemplateNavBar;