import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ tripId: string; noteId: string }>;
}

const updateNoteSchema = z.object({
  content: z.string().min(1),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { noteId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { content: parsed.data.content },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { noteId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.note.delete({ where: { id: noteId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
