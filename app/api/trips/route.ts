import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTripSchema } from "@/lib/validations/trip";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      include: {
        stops: {
          include: { activities: true },
          orderBy: { orderIndex: "asc" },
        },
        expenses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute summary for each trip
    const tripsWithSummary = trips.map((trip) => {
      const allActivities = trip.stops.flatMap((s) => s.activities);
      const totalCost =
        allActivities.reduce((sum, a) => sum + a.cost, 0) +
        trip.expenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        ...trip,
        stopCount: trip.stops.length,
        totalCost,
      };
    });

    return NextResponse.json(tripsWithSummary);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTripSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Generate share token using crypto (no nanoid dependency needed)
    const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

    const trip = await prisma.trip.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        coverImage: parsed.data.coverImage || null,
        shareToken,
      },
      include: {
        stops: { include: { activities: true } },
        expenses: true,
        notes: true,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
