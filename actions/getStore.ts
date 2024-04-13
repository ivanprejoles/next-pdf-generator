import db from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const getStore = async () => {
    try {
        const {userId} = auth()

        if (!userId) {
            return redirectToSignIn()
        }

        const store = await db.stores.findFirst({
            where: {
                userId
            }
        })

        if (!store) {
            redirect('')
        }
        // return NextResponse(store)
    } catch (error) {
        
    }
}