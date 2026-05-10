import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateExpenseSchema } from "@/lib/validations/expense";

interface RouteParams {
  params: Promise<{ tripId: string; expenseId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { expenseId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const d = parsed.data;
    if (d.category !== undefined) updateData.category = d.category;
    if (d.amount !== undefined) updateData.amount = d.amount;
    if (d.currency !== undefined) updateData.currency = d.currency;
    if (d.description !== undefined) updateData.description = d.description;
    if (d.date !== undefined) updateData.date = d.date ? new Date(d.date) : null;

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { expenseId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.expense.delete({ where: { id: expenseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
