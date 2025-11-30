import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/* ============================
   GET — Fetch all categories
=============================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const categories = await prisma.expenseCategory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("GET /categories Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ============================
   POST — Create a new category
=============================== */
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, name, color, icon } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 }
      );
    }

    const category = await prisma.expenseCategory.create({
      data: {
        userId,
        name,
        color: color || null,
        icon: icon || null,
        isDefault: false,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /categories Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
