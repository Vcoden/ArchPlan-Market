import { NextResponse } from "next/server";
import { getSessionAccount, getSessionArchitect } from "@/lib/auth/account";

export async function GET() {
  const profile = await getSessionAccount();
  const architect = await getSessionArchitect();
  return NextResponse.json({ profile, architect });
}
