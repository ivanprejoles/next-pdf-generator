import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipWrapInterface {
    trigger: string,
    children: React.ReactElement
}

const TooltipWrap = ({
    trigger,
    children
}: TooltipWrapInterface) => {
    return (  
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {trigger}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
 
export default TooltipWrap;