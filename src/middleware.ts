import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE, ROUTES } from "./utils/constant";

const adminDefaultRoute = ROUTES.ADMIN.DASHBOARD;
const userDefaultRoute = ROUTES.USER_EVENTS;
const organizerDefaultRoute = ROUTES.ORGANIZER.DASHBOARD;

const publicRoutes = [ROUTES.LOGIN, ROUTES.SIGN_UP];
const organizerRoutes = [ROUTES.ORGANIZER.VERIFY_TICKETS, ROUTES.ORGANIZER.DASHBOARD];

const adminRoutes = [
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.EVENTS,
    ROUTES.ADMIN.CONTACT_US,
    ROUTES.ADMIN.FAQs,
    ROUTES.ADMIN.CREATE_FAQs,
    ROUTES.ADMIN.TERMS_AND_CONDITIONS,
    ROUTES.ADMIN.DROPDOWNS,
    ROUTES.ADMIN.ADMIN_CONFIGURATION,
    ROUTES.ADMIN.USERS
];
const userRoutes = [
    ROUTES.USER_MY_EVENTS,
    ROUTES.USER_PROFILE,
    ROUTES.USER_EVENTS,
    ROUTES.USER_MY_CALENDER,
    ROUTES.USER_EVENTS_DETAILS,
    ROUTES.USER_REWARDED_HISTORY,
    ROUTES.USER_REVIEW_HISTORY,
    ROUTES.USER_MY_CALENDER,
];

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
            [ROLE.Organizer] : organizerRoutes
        };

        const defaultRoutes: Record<string, string> = {
            [ROLE.Admin]: adminDefaultRoute,
            [ROLE.User]: userDefaultRoute,
            [ROLE.Organizer]: organizerDefaultRoute,
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
        "/events",
        "/admin/:path*",
        "/user/:path*",
    ],
};
