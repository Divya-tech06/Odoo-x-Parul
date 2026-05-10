import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTripSchema } from "@/lib/validations/trip";

interface RouteParams {
  params: Promise<{ tripId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: { activities: { orderBy: [{ date: "asc" }, { sortOrder: "asc" }] } },
          orderBy: { orderIndex: "asc" },
        },
        expenses: { orderBy: { createdAt: "desc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Check authorization: must own trip or trip is public
    if (trip.userId !== session?.user?.id && trip.visibility !== "PUBLIC") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("GET /api/trips/[tripId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateTripSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null;
    if (parsed.data.endDate !== undefined) updateData.endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null;
    if (parsed.data.coverImage !== undefined) updateData.coverImage = parsed.data.coverImage;
    if (parsed.data.visibility !== undefined) updateData.visibility = parsed.data.visibility;
    if (parsed.data.budgetTarget !== undefined) updateData.budgetTarget = parsed.data.budgetTarget;
    if (parsed.data.budgetCurrency !== undefined) updateData.budgetCurrency = parsed.data.budgetCurrency;

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        stops: { include: { activities: true }, orderBy: { orderIndex: "asc" } },
        expenses: true,
        notes: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/trips/[tripId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { tripId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cascade delete handled by Prisma schema
    await prisma.trip.delete({ where: { id: tripId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/trips/[tripId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
