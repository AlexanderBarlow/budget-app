import prisma from "@/lib/prisma";

export async function POST(req) {
  const { id, email } = await req.json();

  try {
    const user = await prisma.User.upsert({
      where: { id },
      update: {},
      create: {
        id, // <- IMPORTANT: Supabase ID
        email,
      },
    });

    return Response.json({ success: true, user });
  } catch (e) {
    console.error("Create User Error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
