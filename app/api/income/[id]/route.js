import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required." }, { status: 400 });
    }

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(incomes);
  } catch (err) {
    console.error("Income GET Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
