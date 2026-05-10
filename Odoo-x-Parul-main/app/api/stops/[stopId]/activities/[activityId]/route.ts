import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateActivitySchema } from "@/lib/validations/activity";

interface RouteParams {
  params: Promise<{ stopId: string; activityId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { stopId, activityId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const d = parsed.data;
    if (d.title !== undefined) updateData.title = d.title;
    if (d.category !== undefined) updateData.category = d.category;
    if (d.cost !== undefined) updateData.cost = d.cost;
    if (d.currency !== undefined) updateData.currency = d.currency;
    if (d.duration !== undefined) updateData.duration = d.duration;
    if (d.date !== undefined) updateData.date = d.date ? new Date(d.date) : null;
    if (d.notes !== undefined) updateData.notes = d.notes;
    if (d.imageUrl !== undefined) updateData.imageUrl = d.imageUrl;
    if (d.sortOrder !== undefined) updateData.sortOrder = d.sortOrder;

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { stopId, activityId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.activity.delete({ where: { id: activityId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
