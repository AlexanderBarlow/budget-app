import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, categories } = body;

    if (!userId || !categories) {
      return NextResponse.json(
        { error: "Missing userId or categories" },
        { status: 400 }
      );
    }

    const expenseData = [];

    categories.forEach((cat) => {
      cat.expenses.forEach((exp) => {
        expenseData.push({
          userId,
          name: exp.name,
          amount: parseFloat(exp.amount),
          category: cat.name,
          isFixed: true, // default
          frequency: "MONTHLY", // optional
        });
      });
    });

    const expenses = await prisma.expense.createMany({
      data: expenseData,
    });

    return NextResponse.json(
      { message: "Expenses saved", count: expenses.count },
      { status: 201 }
    );
  } catch (err) {
    console.error("Expense API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
