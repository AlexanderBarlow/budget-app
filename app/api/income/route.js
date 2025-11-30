import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { predictNextPayDates } from "@/utils/payDatePredictor";

/* -----------------------------------------
   GET – Fetch all income for a user
------------------------------------------ */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Attach predicted pay dates using helper
    const enriched = incomes.map((i) => ({
      ...i,
      predictedDates: predictNextPayDates({
        mostRecentPay: i.mostRecentPay,
        previousPayDate: i.previousPayDate,
        payFrequency: i.payFrequency,
        count: 12,
      }),
    }));

    return NextResponse.json(enriched, { status: 200 });
  } catch (err) {
    console.error("Income GET Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -----------------------------------------
   POST – Create new income record
------------------------------------------ */
export async function POST(req) {
  try {
    const body = await req.json();

    const income = await prisma.income.create({
      data: {
        userId: body.userId,
        incomeSource: body.incomeSource || "Main Job",
        incomeType: body.incomeType,

        salaryAnnual: body.salaryAnnual,
        bonuses: body.bonuses,
        commission: body.commission,

        hourlyRate: body.hourlyRate,
        hoursPerWeek: body.hoursPerWeek,
        overtimeRate: body.overtimeRate,
        overtimeHours: body.overtimeHours,
        holidayRate: body.holidayRate,
        holidayHours: body.holidayHours,
        tips: body.tips,

        payFrequency: body.payFrequency,

        mostRecentPay: body.mostRecentPay ? new Date(body.mostRecentPay) : null,

        previousPayDate: body.previousPayDate
          ? new Date(body.previousPayDate)
          : null,
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (err) {
    console.error("Income API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
