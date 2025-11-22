import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  const { email } = await req.json();

  try {
    await prisma.user.create({
      data: {
        email,
      },
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
