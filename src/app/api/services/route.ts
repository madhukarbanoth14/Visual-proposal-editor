import { NextResponse } from "next/server";
import { getServiceTemplates } from "@/lib/quotation-service";

export async function GET() {
  const services = await getServiceTemplates();
  return NextResponse.json(services);
}
