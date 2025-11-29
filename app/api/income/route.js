import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      incomeSource,
      incomeType,

      // Salary fields
      salaryAnnual,
      bonuses,
      commission,

      // Hourly fields
      hourlyRate,
      hoursPerWeek,
      overtimeRate,
      overtimeHours,
      holidayRate,
      holidayHours,
      tips,

      payFrequency,
    } = body;

    // Basic validation
    if (!userId || !incomeType || !payFrequency) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create income record
    const income = await prisma.income.create({
      data: {
        userId,
        incomeSource,

        incomeType,

        // Salary values
        salaryAnnual: incomeType === "SALARY" ? salaryAnnual : null,
        bonuses: incomeType === "SALARY" ? bonuses : null,
        commission: incomeType === "SALARY" ? commission : null,

        // Hourly values
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
