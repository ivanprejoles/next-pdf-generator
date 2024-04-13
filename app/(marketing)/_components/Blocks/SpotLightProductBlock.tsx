import { Spotlight } from "@/components/ui/Spotlight";
import { ThreeDCardProduct } from "./_components/3DCardProduct";


const SpotLightProductBlock = () => {
    return (
        <>
            <Spotlight
                className="left-[10px] md:left-[80px] md:-top-[10px]"
                fill="white"
            />
            <ThreeDCardProduct />
        </>  
    );
}
 
export default SpotLightProductBlock;