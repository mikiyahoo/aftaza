import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware function to check if the request is authenticated as admin
 * Returns the user token if authenticated, null otherwise
 */
export async function requireAdminAuth(request: NextRequest) {
  const token = await getToken({ 
    req: request as any, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token || !token.role || token.role !== "admin") {
    return null;
  }

  return token;
}

/**
 * Helper to create an unauthorized response
 */
export function unauthorizedResponse(message = "Unauthorized - Admin access required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Helper to create a forbidden response
 */
export function forbiddenResponse(message = "Forbidden - Insufficient permissions") {
  return NextResponse.json({ error: message }, { status: 403 });
}
