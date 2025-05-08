import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE, ROUTES } from "./utils/constant";

const adminDefaultRoute = ROUTES.ADMIN.DASHBOARD;
const userDefaultRoute = ROUTES.USER_EVENTS;

const publicRoutes = [ROUTES.LOGIN, ROUTES.SIGN_UP];
const adminRoutes = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.EVENTS, ROUTES.ADMIN.CONTACT_US, ROUTES.ADMIN.FAQs, ROUTES.ADMIN.CREATE_FAQs, ROUTES.ADMIN.TERMS_AND_CONDITIONS];
const userRoutes = [ROUTES.USER_MY_EVENTS, ROUTES.USER_PROFILE, ROUTES.USER_EVENTS,ROUTES.USER_EVENTS_DETAILS];

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userRole = payload.role as string;

        if (!userRole) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
        }

        const roleRoutes: Record<string, string[]> = {
            [ROLE.Admin]: adminRoutes,
            [ROLE.User]: userRoutes,
        };

        const defaultRoutes: Record<string, string> = {
            [ROLE.Admin]: adminDefaultRoute,
            [ROLE.User]: userDefaultRoute,
        };

        const allowedRoutes = roleRoutes[userRole] || [];
        const defaultRedirect = defaultRoutes[userRole] || "/";

        if (isPublicRoute) {
            return NextResponse.redirect(new URL(defaultRedirect, request.url));
        }

        const isAllowed = allowedRoutes.some(route => currentPath.startsWith(route));
        if (!isAllowed) {
            return NextResponse.redirect(new URL(defaultRedirect, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
}

export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/events",
        "/admin/:path*",
        "/user/:path*",
    ],
};
