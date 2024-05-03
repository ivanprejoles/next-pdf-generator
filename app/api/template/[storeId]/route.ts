import db from '@/lib/prismadb';
import { auth, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';


export async function POST (
    req: Request,
    { params } : { params: { storeId: string} }
) {
    try {
        const { userId } = auth()
        const { emptyTemplate } = await req.json()
        if (!userId) {
            return redirectToSignIn()
        }
        
        let template = await db.templates.findFirst({
            where: {
                userId,
                storeId: params.storeId
            }
        })
        
        if (!template) {
            template = await db.templates.create({
                data: {
                    userId,
                    storeId: params.storeId,
                    templateData: emptyTemplate
                }
            })
        }

        return NextResponse.json(template)
        
    } catch ( error ) {
        console.log('[GET TEMPLATE ERR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const { templateData } = await req.json();

    if (!userId) {
      return redirectToSignIn();
    }

    const existingTemplate = await db.templates.findFirst({
      where: {
        storeId: params.storeId,
        userId,
      },
    });

    if (existingTemplate) {
      await db.templates.update({
        where: {
          id: existingTemplate.id, // Explicitly include `id` for clarity
        },
        data: {
          templateData,
        },
      });
    } else {
      await db.templates.create({
        data: {
          userId,
          storeId: params.storeId,
          templateData,
        },
      });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log('[UPDATE TEMPLATE ERR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
