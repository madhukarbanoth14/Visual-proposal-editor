import { NextResponse } from "next/server";
import { getTermTemplates } from "@/lib/quotation-service";

export async function GET() {
  const terms = await getTermTemplates();
  return NextResponse.json(terms);
}
