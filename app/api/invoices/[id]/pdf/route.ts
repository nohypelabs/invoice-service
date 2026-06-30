import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data: raw } = await (db().from("invoices") as any)
    .select("*")
    .eq("id", id)
    .single();

  const invoice = raw as Record<string, unknown> | null;

  if (!invoice || !invoice.pdf_url) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const { data } = await db().storage
    .from("invoices")
    .download(invoice.pdf_url as string);

  if (!data) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.number as string}.pdf"`,
    },
  });
}
