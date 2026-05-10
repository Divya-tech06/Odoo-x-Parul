import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStopSchema } from "@/lib/validations/stop";

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
      include: { activities: { orderBy: [{ date: "asc" }, { sortOrder: "asc" }] } },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json(stops);
  } catch (error) {
    console.error("GET /api/trips/[tripId]/stops error:", error);
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

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createStopSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        city: parsed.data.city,
        country: parsed.data.country,
        countryCode: parsed.data.countryCode || null,
        latitude: parsed.data.latitude || null,
        longitude: parsed.data.longitude || null,
        arrivalDate: parsed.data.arrivalDate ? new Date(parsed.data.arrivalDate) : null,
        departureDate: parsed.data.departureDate ? new Date(parsed.data.departureDate) : null,
        coverImage: parsed.data.coverImage || null,
        orderIndex: parsed.data.orderIndex,
      },
      include: { activities: true },
    });

    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips/[tripId]/stops error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
