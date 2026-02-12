import { NextResponse } from "next/server";
import { clearSessionCookie, getSession, invalidateUserSessions } from "@/lib/auth";

export async function POST() {
  const session = await getSession();

  // Invalidate all sessions for this user
  if (session) {
    await invalidateUserSessions(session.userId);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearSessionCookie());
  return response;
}
