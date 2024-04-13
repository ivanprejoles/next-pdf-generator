import CreateStoreModal from "@/components/modals/create-store-modal"
import db from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const SetupPage = async () => {
    const {userId} = auth()

    if (!userId) {
        return redirectToSignIn()
    }

    const store = await db.stores.findFirst({
        where: {
            userId
        }
    })

    if (store) {
        return redirect(`/template/${store.id}`)
    }

    return <CreateStoreModal/>
}

export default SetupPage;