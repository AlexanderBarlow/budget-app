import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, email } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing id/email" }, { status: 400 });
    }

    // Ensures Prisma matches Supabase ALWAYS
    const user = await prisma.user.upsert({
      where: { id },
      update: { email },
      create: { id, email },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("User Sync Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
