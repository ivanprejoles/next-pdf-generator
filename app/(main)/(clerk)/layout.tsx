import { WavyBackground } from "@/components/ui/wavy-background";

const AuthLayout = (
    {children} : {children: React.ReactNode}
) => {
    return ( 
        <div className="flex items-center justify-center h-full">
            <WavyBackground className="mx-auto flex items-center justify-center">
                {children}
            </WavyBackground>
        </div>
     );
}
 
export default AuthLayout;