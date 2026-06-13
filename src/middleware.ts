import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

// Simple in-memory rate limiting (Note: in production edge, use Redis/Upstash)
const rateLimit = new Map<string, { count: number, timestamp: number }>();

export default clerkMiddleware(async (auth, req) => {
  // Rate limiting logic
  const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60; // 60 requests per minute
  
  const record = rateLimit.get(ip);
  if (record && now - record.timestamp < windowMs) {
    if (record.count >= maxRequests) {
      return new NextResponse("Too Many Requests - Please try again later", { status: 429 });
    }
    record.count += 1;
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now });
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
