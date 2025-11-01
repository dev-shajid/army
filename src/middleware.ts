import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_REDIRECT_URL, DEFAULT_REDIRECT_URL, isAuthRoute, isPublicRoute } from './route'
import { createClient } from './supabase/server'


export async function middleware(request: NextRequest) {

    const supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = await createClient()

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    try {
        const { data: { user }, } = await supabase.auth.getUser()

        const pathname = request.nextUrl.pathname

        if (isPublicRoute(pathname)) {
            return supabaseResponse;
        }

        if (!user && !isAuthRoute(pathname)) {
            // Not authenticated and not on an auth route -> send to signin
            const url = new URL(AUTH_REDIRECT_URL, request.url)
            return NextResponse.redirect(url)
        }

        if (user && isAuthRoute(pathname)) {
            // Already authenticated visiting an auth route -> send to app home
            const url = new URL(DEFAULT_REDIRECT_URL, request.url)
            return NextResponse.redirect(url)
        }
    } catch (error) {
        console.error("Error in middleware:", error)
        // Return response to allow page to load, user will be treated as unauthenticated
        return supabaseResponse
    }



    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}