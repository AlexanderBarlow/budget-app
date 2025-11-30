import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
  try {
    const { id } = await context.params; // ✅ Works in all Next.js 14–16 versions

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE Expense Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    const { id } = await context.params; // SAME FIX

    const data = await req.json();

    const updated = await prisma.expense.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH Expense Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
