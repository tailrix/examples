import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/') {
        const ua = req.headers.get('user-agent') ?? ''
        if (ua.startsWith('GoogleHC/')) {
            return new NextResponse('OK', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
            })
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/'],
}
