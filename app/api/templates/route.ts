import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";

import { db } from "@/lib/db/client";

const bodySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  fromName: z.string().min(1),
  fromAddress: z.string().min(1),
  fromEmail: z.string().email(),
  taxRate: z.number().min(0).max(100).default(0),
  currency: z.string().default("USD"),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id, name, fromName, fromAddress, fromEmail, taxRate, currency } = parsed.data;

  const { data, error } = await (db().from("projects") as any)
    .upsert({
      id: id ?? nanoid(),
      name,
      from_name: fromName,
      from_address: fromAddress,
      from_email: fromEmail,
      tax_rate: taxRate,
      currency,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const { data, error } = await (db().from("projects") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  }

  return NextResponse.json(data);
}
