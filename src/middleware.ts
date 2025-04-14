import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE, ROUTES } from "./utils/constant";

const adminDefaultRoute = ROUTES.ADMIN.DASHBOARD;
const userDefaultRoute = ROUTES.USER_EVENTS;

const publicRoutes = [ROUTES.LOGIN, ROUTES.SIGN_UP];
const adminRoutes = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.EVENTS];
const userRoutes = [ROUTES.USER_PROFILE, ROUTES.USER_EVENTS];

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname;

    const isPublicRoute = publicRoutes.includes(currentPath);
    const token = request.cookies.get("token")?.value;

    if (!token) {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userRole = payload.role as string;

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

        // If trying to access a public route while logged in, redirect to role-based default
        if (isPublicRoute) {
            return NextResponse.redirect(new URL(defaultRedirect, request.url));
        }

        // If current path is not allowed for the role, redirect
        if (!allowedRoutes.includes(currentPath)) {
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
        "/",
        "/login",
        "/signup",
        "/admin/:path*",
        "/user-profile", // Include user route explicitly
    ],
};
