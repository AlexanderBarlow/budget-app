import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ------- UPDATE INCOME -------
export async function PATCH(req, context) {
  const { params } = await context;
  const realParams = await params; // <-- FIX
  const incomeId = realParams.id;

  try {
    const data = await req.json();

    const updated = await prisma.Income.update({
      where: { id: incomeId },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Income PATCH Error:", err);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

// ------- DELETE INCOME -------
export async function DELETE(req, context) {
  const { params } = await context;
  const realParams = await params; // <-- FIX
  const incomeId = realParams.id;

  if (!incomeId) {
    return NextResponse.json({ error: "Missing income ID." }, { status: 400 });
  }

  try {
    await prisma.Income.delete({
      where: { id: incomeId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Income DELETE Error:", err);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}
