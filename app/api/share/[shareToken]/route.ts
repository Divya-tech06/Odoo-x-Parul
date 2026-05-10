import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ shareToken: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { shareToken } = await params;

    const trip = await prisma.trip.findFirst({
      where: {
        shareToken,
        visibility: "PUBLIC",
      },
      include: {
        stops: {
          include: {
            activities: { orderBy: [{ date: "asc" }, { sortOrder: "asc" }] },
          },
          orderBy: { orderIndex: "asc" },
        },
        expenses: true,
        user: {
          select: { name: true, image: true }, // Don't expose email
        },
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "This itinerary is private or doesn't exist" },
        { status: 404 }
      );
    }

    // Compute budget summary
    const allActivities = trip.stops.flatMap((s) => s.activities);
    const totalCost =
      allActivities.reduce((sum, a) => sum + a.cost, 0) +
      trip.expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      ...trip,
      totalCost,
      stopCount: trip.stops.length,
      activityCount: allActivities.length,
    });
  } catch (error) {
    console.error("GET /api/share/[shareToken] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
