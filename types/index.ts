export interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

export interface InvoiceConfig {
  projectId: string
  projectName: string
  logo?: string
  fromName: string
  fromAddress: string
  fromEmail: string
  taxRate: number
  currency: string
}

export interface CreateInvoiceInput {
  projectId: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  items: InvoiceItem[]
  dueDays?: number
  notes?: string
}

export interface Invoice {
  id: string
  number: string
  projectId: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue"
  issuedAt: string
  dueAt: string
  notes?: string
  pdfUrl?: string
  createdAt: string
}
