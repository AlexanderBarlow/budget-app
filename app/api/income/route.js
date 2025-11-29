import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json(incomes, { status: 200 });
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

    const {
      userId,
      incomeSource,
      incomeType,

      // salary fields
      salaryAnnual,
      bonuses,
      commission,

      // hourly fields
      hourlyRate,
      hoursPerWeek,
      overtimeRate,
      overtimeHours,
      holidayRate,
      holidayHours,
      tips,

      payFrequency,
    } = body;

    // Required fields
    if (!userId || !incomeType || !payFrequency) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        userId,
        incomeSource: incomeSource || "Main Job",
        incomeType,

        // Salary
        salaryAnnual: incomeType === "SALARY" ? salaryAnnual : null,
        bonuses: bonuses ? Number(bonuses) : null,
        commission: commission ? Number(commission) : null,

        // Hourly
        hourlyRate: incomeType === "HOURLY" ? hourlyRate : null,
        hoursPerWeek: incomeType === "HOURLY" ? hoursPerWeek : null,
        overtimeRate: incomeType === "HOURLY" ? overtimeRate : null,
        overtimeHours: incomeType === "HOURLY" ? overtimeHours : null,
        holidayRate: incomeType === "HOURLY" ? holidayRate : null,
        holidayHours: incomeType === "HOURLY" ? holidayHours : null,
        tips: incomeType === "HOURLY" ? tips : null,

        payFrequency,
        mostRecentPay: new Date(),
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (err) {
    console.error("Income API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
