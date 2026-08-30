import { NextResponse } from "next/server";
import { getDeliverableTemplates } from "@/lib/quotation-service";

export async function GET() {
  const deliverables = await getDeliverableTemplates();
  return NextResponse.json(deliverables);
}
