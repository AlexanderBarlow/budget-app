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

    const categoryData = categories.map((cat) => ({
      userId,
      name: cat.name,
      percentage: cat.percentage ?? 0,
      targetAmount: null,
      color: cat.color ?? null,
      isCustom: true,
    }));

    const created = await prisma.budgetCategory.createMany({
      data: categoryData,
    });

    return NextResponse.json({ count: created.count }, { status: 201 });
  } catch (err) {
    console.error("Category API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
