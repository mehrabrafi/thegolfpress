import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — runs BEFORE page rendering.
 * 
 * Security: Protects /tgpadmin/* routes by checking for an auth cookie.
 * If no token cookie is present, redirects to login page.
 * 
 * Note: This is a first-line defense. The backend API still validates
 * the JWT token and role on every request, so even if someone bypasses
 * this middleware, they can't actually perform any admin actions.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Protect /tgpadmin/* routes ──────────────────────────────────
    if (pathname.startsWith('/tgpadmin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            // No auth cookie → redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Token exists — let the page render.
        // The actual role check happens on the backend when the page
        // fetches admin data. If the token is invalid or the user
        // isn't an admin, the API will return 401/403.
    }

    // ── Security Headers (applied to ALL routes) ─────────────────
    const response = NextResponse.next();

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy — don't leak full URLs to external sites
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy — disable unnecessary browser features
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    // Content Security Policy — primary defense against XSS
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",         // Next.js requires unsafe-inline/eval
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://cdn.thegolfpress.com https://a.espncdn.com https://*.espncdn.com https://maps.google.com https://maps.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com",
        "frame-src 'self' https://maps.google.com https://www.google.com",
        "connect-src 'self' https://cdn.thegolfpress.com https://api.thegolfpress.com https://thegolfpress.com https://*.espn.com https://www.google-analytics.com",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ].join('; ');
    response.headers.set('Content-Security-Policy', csp);

    // Strict Transport Security — force HTTPS for 1 year
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    return response;
}

// Only run middleware on these paths (skip static assets, API routes, etc.)
export const config = {
    matcher: [
        // Admin routes
        '/tgpadmin/:path*',
        // Main public pages (for security headers)
        '/',
        '/news/:path*',
        '/courses/:path*',
        '/guides-and-tips/:path*',
        '/players/:path*',
        '/scores',
        '/rankings',
        '/schedule',
        '/privacy',
        '/terms',
        '/cookies-policy',
        '/login',
        '/signup',
    ],
};
