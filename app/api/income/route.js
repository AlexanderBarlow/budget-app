import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      incomeType,
      salaryAnnual,
      hourlyRate,
      hoursPerWeek,
      payFrequency,
    } = body;

    if (!userId || !incomeType || !payFrequency) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const income = await prisma.Income.create({
      data: {
        userId,
        incomeType,
        salaryAnnual: incomeType === "SALARY" ? salaryAnnual : null,
        hourlyRate: incomeType === "HOURLY" ? hourlyRate : null,
        hoursPerWeek: incomeType === "HOURLY" ? hoursPerWeek : null,
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
