import db from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return redirectToSignIn()

        }

        const stores = await db.stores.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                name: true,
                shareCode: true
            }
        })
        
        return NextResponse.json(stores)
    } catch (error) {
        console.log('[SERVER_POST][TEMPLATES]', error)
        return new NextResponse('[Internal Error][TEMPLATES]', {status: 500})
    }
}