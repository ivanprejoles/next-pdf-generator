import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/prismadb";

import { ModeToggle } from "./mode-toggle";
import StoreSwitcher from "@/components/store-switcher";
import CreateStoreModal from "@/components/modals/create-store-modal";

const TemplateNavBar = async () => {
    const { userId } = auth()


    if (!userId) {
        return redirect('/')
    }

    const stores = await db.stores.findMany({
        where: {
            userId
        }
    })

    if (!stores) {
        return <CreateStoreModal />
    }

    return (  
        <div className="w-full fixed flex flex-row justify-between items-center p-2 h-[56px] shadow-sm z-50 bg-[#2121] dark:bg-[#5a5858] text-white dark:text-black">
            <StoreSwitcher items={stores} />
            <div className="flex flex-row items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}
 
export default TemplateNavBar;