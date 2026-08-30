import { NextResponse } from "next/server";
import { getBrandSettings, updateBrandSettings } from "@/lib/quotation-service";

export async function GET() {
  const brand = await getBrandSettings();
  return NextResponse.json(brand);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const brand = await updateBrandSettings(body);
  return NextResponse.json(brand);
}
