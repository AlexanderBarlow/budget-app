import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET accounts
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(accounts);
}

// POST create new account
export async function POST(req) {
  try {
    const body = await req.json();

    const account = await prisma.account.create({
      data: {
        userId: body.userId,
        type: body.type,
        institution: body.institution,
        nickname: body.nickname,
        balance: body.balance,
        interestRate: body.interestRate,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
