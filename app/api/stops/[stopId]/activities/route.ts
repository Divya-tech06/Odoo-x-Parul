import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createActivitySchema } from "@/lib/validations/activity";

interface RouteParams {
  params: Promise<{ stopId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { stopId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: { stopId },
      orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("GET /api/stops/[stopId]/activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { stopId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify stop exists and user owns the trip
    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop || stop.trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Stop not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Get max sort order for this stop
    const maxSort = await prisma.activity.aggregate({
      where: { stopId },
      _max: { sortOrder: true },
    });

    const activity = await prisma.activity.create({
      data: {
        stopId,
        title: parsed.data.title,
        category: parsed.data.category,
        cost: parsed.data.cost ?? 0,
        currency: parsed.data.currency ?? "USD",
        duration: parsed.data.duration || null,
        date: parsed.data.date ? new Date(parsed.data.date) : null,
        notes: parsed.data.notes || null,
        imageUrl: parsed.data.imageUrl || null,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST /api/stops/[stopId]/activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
