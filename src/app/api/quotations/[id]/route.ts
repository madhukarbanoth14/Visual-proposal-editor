import { NextResponse } from "next/server";
import { getQuotation, updateQuotation, deleteQuotation, duplicateQuotation } from "@/lib/quotation-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quotation = await getQuotation(id);
  if (!quotation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quotation);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const quotation = await updateQuotation(id, body.data, body.status);
  return NextResponse.json(quotation);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteQuotation(id);
  return NextResponse.json({ success: true });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (body.action === "duplicate") {
    const quotation = await duplicateQuotation(id);
    return NextResponse.json(quotation, { status: 201 });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
