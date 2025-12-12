import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { predictNextPayDates } from "@/utils/payDatePredictor";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
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

export async function POST(req) {
  try {
    const body = await req.json();

    const income = await prisma.income.create({
      data: {
        userId: body.userId,
        source: body.source,
        type: body.type,
        payFrequency: body.payFrequency,

        grossPerPeriod: body.grossPerPeriod,
        netPerPeriod: body.netPerPeriod,
        manualOverride: body.manualOverride,

        lastPaid: body.lastPaid,
        nextExpected: body.nextExpected,
        predictedDates: body.predictedDates,
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (err) {
    console.error("Income POST Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
