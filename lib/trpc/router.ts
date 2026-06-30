import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { nanoid } from "nanoid";

import { db } from "@/lib/db/client";
import { generateInvoice } from "@/lib/pdf/generate";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

const invoiceSchema = z.object({
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

const projectSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  fromName: z.string().min(1),
  fromAddress: z.string().min(1),
  fromEmail: z.string().email(),
  taxRate: z.number().min(0).max(100).default(0),
  currency: z.string().default("USD"),
});

export const appRouter = router({
  invoice: {
    list: procedure.query(async () => {
      const { data, error } = await (db().from("invoices") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Record<string, unknown>[];
    }),

    byId: procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { data, error } = await (db().from("invoices") as any)
        .select("*")
        .eq("id", input.id)
        .single();

      if (error || !data) throw new Error("Invoice not found");
      return data as Record<string, unknown>;
    }),

    create: procedure.input(invoiceSchema).mutation(async ({ input }) => {
      const { data: rawProject } = await (db().from("projects") as any)
        .select("*")
        .eq("id", input.projectId)
        .single();

      if (!rawProject) throw new Error("Project not found");

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

      if (error) throw new Error(error.message);
      return rawInvoice as Record<string, unknown>;
    }),

    update: procedure.input(z.object({
      id: z.string(),
      data: z.record(z.unknown()),
    })).mutation(async ({ input }) => {
      const result = await (db().from("invoices") as any)
        .update(input.data)
        .eq("id", input.id)
        .select()
        .single();

      if (result.error) throw new Error(result.error.message);
      return result.data as Record<string, unknown>;
    }),

    pdfUrl: procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { data: raw } = await (db().from("invoices") as any)
        .select("pdf_url, number")
        .eq("id", input.id)
        .single();

      if (!raw?.pdf_url) throw new Error("PDF not found");
      return raw as { pdf_url: string; number: string };
    }),
  },

  template: {
    list: procedure.query(async () => {
      const { data, error } = await (db().from("projects") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Record<string, unknown>[];
    }),

    create: procedure.input(projectSchema).mutation(async ({ input }) => {
      const { data, error } = await (db().from("projects") as any)
        .upsert({
          id: input.id ?? nanoid(),
          name: input.name,
          from_name: input.fromName,
          from_address: input.fromAddress,
          from_email: input.fromEmail,
          tax_rate: input.taxRate,
          currency: input.currency,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Record<string, unknown>;
    }),
  },
});

export type AppRouter = typeof appRouter;
