import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ tripId: string }>;
}

const createNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  stopId: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        tripId,
        content: parsed.data.content,
        stopId: parsed.data.stopId || null,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
