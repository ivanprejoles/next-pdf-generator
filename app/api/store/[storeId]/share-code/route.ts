import {v4 as uuidv4} from 'uuid'
import db from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return redirectToSignIn()
        }

        const store = await db.stores.update({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                shareCode: uuidv4()
            }
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log('[SERVER_ID]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}