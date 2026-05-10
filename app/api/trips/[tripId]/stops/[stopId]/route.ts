import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStopSchema } from "@/lib/validations/stop";

interface RouteParams {
  params: Promise<{ tripId: string; stopId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId, stopId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateStopSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const d = parsed.data;
    if (d.city !== undefined) updateData.city = d.city;
    if (d.country !== undefined) updateData.country = d.country;
    if (d.countryCode !== undefined) updateData.countryCode = d.countryCode;
    if (d.latitude !== undefined) updateData.latitude = d.latitude;
    if (d.longitude !== undefined) updateData.longitude = d.longitude;
    if (d.arrivalDate !== undefined) updateData.arrivalDate = d.arrivalDate ? new Date(d.arrivalDate) : null;
    if (d.departureDate !== undefined) updateData.departureDate = d.departureDate ? new Date(d.departureDate) : null;
    if (d.coverImage !== undefined) updateData.coverImage = d.coverImage;
    if (d.orderIndex !== undefined) updateData.orderIndex = d.orderIndex;

    const updated = await prisma.tripStop.update({
      where: { id: stopId },
      data: updateData,
      include: { activities: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/trips/[tripId]/stops/[stopId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId, stopId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the stop (activities cascade)
    await prisma.tripStop.delete({ where: { id: stopId } });

    // Reindex remaining stops
    const remainingStops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { orderIndex: "asc" },
    });

    await prisma.$transaction(
      remainingStops.map((stop, index) =>
        prisma.tripStop.update({
          where: { id: stop.id },
          data: { orderIndex: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/trips/[tripId]/stops/[stopId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
