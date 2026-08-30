import { NextResponse } from "next/server";
import { getAllQuotations, createQuotation } from "@/lib/quotation-service";

export async function GET() {
  const quotations = await getAllQuotations();
  return NextResponse.json(quotations);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const quotation = await createQuotation(body.sample === true);
  return NextResponse.json(quotation, { status: 201 });
}
