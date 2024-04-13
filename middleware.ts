import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import db from "./lib/prismadb";
import { NextResponse } from "next/server";
 
// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
 
export default authMiddleware({
  publicRoutes: ['/'],
  async afterAuth(auth, req) {
    if (auth.userId && auth.isPublicRoute) {
      const storeSelection = new URL('/template', req.url)
      return NextResponse.redirect(storeSelection)
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({returnBackUrl: req.url})
    }
  }
});
 
export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
 
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)"
    // Re-include any files in the api or trpc folders that might have an extension
  ]
};