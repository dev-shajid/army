'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    const next = searchParams.get('next') ?? '/signin'

    if (userId && secret) {
        try {
            // TODO: Verify the email using your auth service
            // await authService.updateVerification(userId, secret)

            // Redirect user to signin with success message
            const url = new URL(next, request.url)
            url.searchParams.set('verified', 'true')
            return NextResponse.redirect(url)
        } catch (error) {
            console.error('Email verification error:', error)
            // Redirect to signin with error param
            const url = new URL('/signin', request.url)
            url.searchParams.set('error', 'verification_failed')
            return NextResponse.redirect(url)
        }
    }

    // redirect the user to signin with invalid link error
    const url = new URL('/signin', request.url)
    url.searchParams.set('error', 'invalid_verification_link')
    return NextResponse.redirect(url)
}
