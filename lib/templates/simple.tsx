import React from "react";
import {
  Document, Page, Text, View, StyleSheet,
} from "@react-pdf/renderer";
import type { CreateInvoiceInput, InvoiceConfig } from "@/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { fontSize: 20, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#2563eb", marginBottom: 4 },
  label: { color: "#6b7280", marginBottom: 2 },
  section: { marginBottom: 20 },
  row: { flexDirection: "row", borderBottom: "1 solid #e5e7eb", paddingVertical: 6 },
  rowHeader: { backgroundColor: "#f3f4f6", fontWeight: "bold" },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "right" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  totals: { marginTop: 10, marginLeft: "auto", width: "40%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  grandTotal: { fontWeight: "bold", fontSize: 12, borderTop: "1 solid #000", paddingTop: 6 },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, color: "#9ca3af", fontSize: 9, textAlign: "center" },
});

export function SimpleInvoice({ input, config }: { input: CreateInvoiceInput; config: InvoiceConfig }) {
  const subtotal = input.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const taxAmount = subtotal * (config.taxRate / 100);
  const total = subtotal + taxAmount;
  const dueAt = new Date(Date.now() + (input.dueDays ?? 30) * 86400000);
  const number = `INV-${Date.now().toString(36).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.label}>{number}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>{config.fromName}</Text>
            <Text>{config.fromAddress}</Text>
            <Text>{config.fromEmail}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={{ fontWeight: "bold" }}>{input.clientName}</Text>
          {input.clientAddress && <Text>{input.clientAddress}</Text>}
          {input.clientEmail && <Text>{input.clientEmail}</Text>}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <View>
            <Text style={styles.label}>Issue Date</Text>
            <Text>{new Date().toLocaleDateString()}</Text>
          </View>
          <View>
            <Text style={styles.label}>Due Date</Text>
            <Text>{dueAt.toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.rowHeader]}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Price</Text>
            <Text style={styles.col4}>Amount</Text>
          </View>
          {input.items.map((item, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>{item.price.toFixed(2)}</Text>
              <Text style={styles.col4}>{(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax ({config.taxRate}%)</Text>
            <Text>{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total</Text>
            <Text>{total.toFixed(2)} {config.currency}</Text>
          </View>
        </View>

        {input.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Notes</Text>
            <Text>{input.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
}
