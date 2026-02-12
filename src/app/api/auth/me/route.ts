import { NextResponse } from "next/server";
import { getSession, validateSession, clearSessionCookie } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Validate token version against database
  const validSession = await validateSession(session);

  if (!validSession) {
    // Token version mismatch - session invalidated
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.set(clearSessionCookie());
    return response;
  }

  return NextResponse.json({
    user: { id: validSession.userId, username: validSession.username },
  });
}
