import { NextResponse } from "next/server";
import { getAlbumTemplates } from "@/lib/quotation-service";

export async function GET() {
  const albums = await getAlbumTemplates();
  return NextResponse.json(albums);
}
