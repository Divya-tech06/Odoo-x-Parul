import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ tripId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      include: { activities: true },
    });

    const allActivities = stops.flatMap((s) => s.activities);
    return NextResponse.json(allActivities);
  } catch (error) {
    console.error("GET /api/trips/[tripId]/activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
