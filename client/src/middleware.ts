import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: Request) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("accessToken");
    console.log("authCookie", authCookie);
    const { pathname } = new URL(request.url);

    if (pathname === "/" && authCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard") && !authCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/"],
};
