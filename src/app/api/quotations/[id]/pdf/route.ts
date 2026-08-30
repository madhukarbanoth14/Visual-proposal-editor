import { NextResponse } from "next/server";
import { getQuotation } from "@/lib/quotation-service";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPDF } from "@/components/pdf/proposal-pdf";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quotation = await getQuotation(id);
  if (!quotation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const buffer = await renderToBuffer(ProposalPDF({ quotation }));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="proposal-${quotation.quotationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
