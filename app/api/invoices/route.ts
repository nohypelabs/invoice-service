import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";

import { db } from "@/lib/db/client";
import { generateInvoice } from "@/lib/pdf/generate";
import type { CreateInvoiceInput } from "@/types";

const bodySchema = z.object({
  projectId: z.string().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().email().optional(),
  clientAddress: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    price: z.number().nonnegative(),
  })).min(1),
  dueDays: z.number().int().positive().default(30),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data as CreateInvoiceInput;

  const { data: rawProject } = await (db().from("projects") as any)
    .select("*")
    .eq("id", input.projectId)
    .single();

  if (!rawProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const project = rawProject as {
    id: string; name: string; from_name: string; from_address: string;
    from_email: string; tax_rate: number; currency: string;
  };

  const subtotal = input.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const taxAmount = subtotal * (project.tax_rate / 100);
  const total = subtotal + taxAmount;
  const number = `INV-${nanoid(8).toUpperCase()}`;
  const dueAt = new Date(Date.now() + (input.dueDays ?? 30) * 86400000).toISOString();

  const pdfBuffer = await generateInvoice(input, {
    projectId: project.id,
    projectName: project.name,
    fromName: project.from_name,
    fromAddress: project.from_address,
    fromEmail: project.from_email,
    taxRate: project.tax_rate,
    currency: project.currency,
  });

  const pdfName = `${number}.pdf`;
  const { data: upload } = await db().storage
    .from("invoices")
    .upload(pdfName, pdfBuffer, { contentType: "application/pdf" });

  const { data: rawInvoice, error } = await (db().from("invoices") as any)
    .insert({
      id: nanoid(),
      number,
      project_id: input.projectId,
      client_name: input.clientName,
      client_email: input.clientEmail,
      client_address: input.clientAddress,
      items: JSON.stringify(input.items),
      subtotal,
      tax_rate: project.tax_rate,
      tax_amount: taxAmount,
      total,
      currency: project.currency,
      status: "draft",
      due_at: dueAt,
      notes: input.notes,
      pdf_url: (upload as { path?: string } | null)?.path ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  }

  return NextResponse.json(rawInvoice, { status: 201 });
}

export async function GET() {
  const { data, error } = await (db().from("invoices") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  }

  return NextResponse.json(data);
}
