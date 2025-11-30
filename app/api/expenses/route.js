import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/* -----------------------------------------
   GET — Fetch expenses for user
------------------------------------------ */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(expenses);
}

/* -----------------------------------------
   POST — Create a new expense
------------------------------------------ */
export async function POST(req) {
  try {
    const { userId, name, amount, categoryId, frequency, billingDate } =
      await req.json();

    const today = new Date();
    const parsedBilling = billingDate ? new Date(billingDate) : null;

    const nextCharge = parsedBilling
      ? computeNextCharge(frequency, parsedBilling)
      : null;

    const expense = await prisma.expense.create({
      data: {
        userId,
        name,
        amount,
        categoryId,
        frequency,
        billingDate: parsedBilling,
        nextCharge,
        lastCharge: parsedBilling ?? null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    console.error("Expense API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -----------------------------------------
   Recurrence Logic
------------------------------------------ */
function computeNextCharge(frequency, billingDate) {
  const date = new Date(billingDate);

  switch (frequency) {
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "BIWEEKLY":
      date.setDate(date.getDate() + 14);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "QUARTERLY":
      date.setMonth(date.getMonth() + 3);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "ONCE":
    default:
      return billingDate;
  }

  return date.toISOString();
}
