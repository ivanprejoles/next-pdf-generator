import db from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (
    req: Request,
) {
    try {
        const {userId} = auth()
        
        if (!userId) {
            return redirectToSignIn()
        }

        const {
            name
        } = await req.json()

        const store = await db.stores.create({
            data: {
                userId,
                name
            }
        })

        return NextResponse.json(store)
        
    } catch (error) {
        console.log("[SERVER_POST]", error)
        return new NextResponse("Internal Error", {status:500})
    }
}