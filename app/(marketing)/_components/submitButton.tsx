'use client'

import { Check, CircleAlert, MousePointerClick } from "lucide-react";

interface SubmitButtonInterface {
    title: string,
    disabled: boolean,
    onClick: () => void,
}

const SubmitButton = ({
    title,
    disabled,
    onClick
}: SubmitButtonInterface) => {
    return (  
        <button disabled={disabled} onClick={onClick} className="bg-slate-800 disabled:bg-slate-500 no-underline group cursor-pointer disabled:cursor-not-allowed relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white disabled:text-slate-600 inline-block" >
            <span className="absolute inset-0 overflow-hidden rounded-full">
                {!disabled && (<span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />)}
            </span>
            <div className="relative flex sm:space-x-2 items-center z-10 rounded-full bg-zinc-950 py-4 sm:py-0.5 px-4 ring-1 ring-white/10 disabled:ring-slate-300 ">
                <span className="hidden sm:block">
                    {title}
                </span>
                    {!disabled 
                    ? (
                        <>
                            <MousePointerClick
                                className="text-green-500"
                                width={20}
                                height={20}
                            />
                        </>
                    ) 
                    : (
                        <>
                            <CircleAlert
                                className="text-red-300" 
                                width={20}
                                height={20}
                            />
                        </>
                    )}
            </div>
            {!disabled && (<span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />)}
        </button>
    );
}
 
export default SubmitButton;