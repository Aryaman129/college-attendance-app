import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const response = NextResponse.next();

    // Set proper CORS headers
    response.headers.set("Access-Control-Allow-Origin", req.headers.get("origin") || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: response.headers });
    }

    return response;
}

export const config = {
    matcher: "/api/:path*",
};
