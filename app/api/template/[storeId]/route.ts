import db from '@/lib/prismadb';
import { auth, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';


export async function POST (
    req: Request,
    { params } : { params: { storeId: string} }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return redirectToSignIn()
        }

        const template = await db.templates.findFirst({
            where: {
                userId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(template)
        
    } catch ( error ) {
        console.log('[GET TEMPLATE ERR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}