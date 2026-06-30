import { renderToStream } from "@react-pdf/renderer";

import { SimpleInvoice } from "@/lib/templates";
import type { CreateInvoiceInput, InvoiceConfig } from "@/types";

const TEMPLATES = { simple: SimpleInvoice } as const;

type TemplateName = keyof typeof TEMPLATES;

export async function generateInvoice(
  input: CreateInvoiceInput,
  config: InvoiceConfig,
  template: TemplateName = "simple",
): Promise<Buffer> {
  const Component = TEMPLATES[template];
  const stream = await renderToStream(<Component input={input} config={config} />);

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
