import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ tripId: string }>;
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const visibility = body.visibility as "PUBLIC" | "PRIVATE";

    if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
      return NextResponse.json({ error: "Invalid visibility" }, { status: 400 });
    }

    // Ensure share token exists
    let shareToken = trip.shareToken;
    if (!shareToken) {
      shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    }

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: { visibility, shareToken },
    });

    return NextResponse.json({
      shareToken: updated.shareToken,
      visibility: updated.visibility,
      publicUrl: `/share/${updated.shareToken}`,
    });
  } catch (error) {
    console.error("POST share error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
