import db from "@/lib/prismadb";
import ShareTemplateGenerator from "../../_components/share-template-generator";


const SharePage = async ({
    params
}: {
    params:{shareCode: string}
}) => {
    try {
        const template = await db.stores.findUnique({
            where: {
                shareCode: params.shareCode
            },
            select: {
                template: true
            }
        })
    
        const templateData: any = template?.template[0]?.templateData;
        
        return ( 
            <main className="w-full h-full p-2 px-3 bg-[#EDEADE] dark:bg-black">
                <ShareTemplateGenerator sharedData={templateData} />
            </main>
        );
    } catch (error) {
        return <div>Error fetching template. Please try again later.</div>
    }
}
 
export default SharePage;