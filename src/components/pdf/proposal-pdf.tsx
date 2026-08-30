import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { Quotation } from "@/types/quotation";
import { formatINR } from "@/lib/pricing";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  coverPage: {
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  coverContent: {
    alignItems: "center",
    padding: 60,
  },
  coverTagline: {
    fontSize: 8,
    color: "#c9a962",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  coverDivider: {
    width: 40,
    height: 1,
    backgroundColor: "#c9a962",
    marginBottom: 20,
  },
  coverDate: {
    fontSize: 9,
    color: "#ffffff",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  coverLocation: {
    fontSize: 8,
    color: "#aaaaaa",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#1a1a1a",
  },
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#c9a962",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#666666",
    marginBottom: 12,
  },
  eventName: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventMeta: {
    fontSize: 8,
    color: "#888888",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
  },
  rowLabel: {
    fontSize: 9,
  },
  rowValue: {
    fontSize: 9,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    color: "#c9a962",
  },
  termTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
  },
  termContent: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#666666",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#aaaaaa",
  },
  pageNumber: {
    fontSize: 7,
    color: "#aaaaaa",
  },
});

function formatPdfDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function ProposalPDF({ quotation }: { quotation: Quotation }) {
  const { data, pricing } = quotation;

  return (
    <Document title={`Proposal - ${data.client.displayName}`} author={data.branding.companyName}>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTagline}>{data.branding.tagline || "Wedding Photography & Films"}</Text>
          <Text style={styles.coverTitle}>{data.client.displayName || "Your Names"}</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverDate}>
            {formatPdfDate(data.dates.startDate)}
            {data.dates.endDate && data.dates.endDate !== data.dates.startDate && ` — ${formatPdfDate(data.dates.endDate)}`}
          </Text>
          {data.client.location && <Text style={styles.coverLocation}>{data.client.location.toUpperCase()}</Text>}
        </View>
      </Page>

      {/* Welcome */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>Welcome</Text>
        <Text style={styles.sectionTitle}>Your Wedding Story Begins Here</Text>
        <Text style={styles.paragraph}>{data.welcomeMessage}</Text>
        <View style={styles.footer} fixed>
          <Text>{data.branding.companyName}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Events */}
      {data.events.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionLabel}>Your Journey</Text>
          <Text style={styles.sectionTitle}>Wedding Events</Text>
          {data.events.map((event) => (
            <View key={event.id} style={{ marginBottom: 16 }} wrap={false}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventMeta}>
                {formatPdfDate(event.date)}{event.timeLabel ? ` · ${event.timeLabel}` : ""}{event.location ? ` · ${event.location}` : ""}
              </Text>
              {event.services.map((s) => (
                <Text key={s.id} style={styles.paragraph}>
                  {s.quantity > 1 ? `${s.quantity} ` : ""}{s.name}
                </Text>
              ))}
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>{data.branding.companyName}</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* Deliverables */}
      {data.globalDeliverables.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionLabel}>What You Receive</Text>
          <Text style={styles.sectionTitle}>Deliverables</Text>
          {data.globalDeliverables.map((d) => (
            <View key={d.id} style={{ marginBottom: 12 }} wrap={false}>
              <Text style={{ fontSize: 8, color: "#c9a962", textTransform: "uppercase", letterSpacing: 1 }}>{d.quantity}</Text>
              <Text style={styles.eventName}>{d.name}</Text>
              <Text style={styles.paragraph}>{d.description}</Text>
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>{data.branding.companyName}</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* Investment */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>Investment</Text>
        <Text style={styles.sectionTitle}>Your Proposal</Text>
        {pricing.lineItems.map((group) => (
          <View key={group.category} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: 1, color: "#888888", marginBottom: 6 }}>{group.category}</Text>
            {group.items.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.rowLabel}>{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</Text>
                <Text style={styles.rowValue}>{formatINR(item.total)}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>{formatINR(pricing.subtotal)}</Text>
        </View>
        {pricing.discountAmount > 0 && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{data.discount.label}</Text>
            <Text style={styles.rowValue}>−{formatINR(pricing.discountAmount)}</Text>
          </View>
        )}
        {data.tax.enabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{data.tax.label} ({data.tax.rate}%)</Text>
            <Text style={styles.rowValue}>{formatINR(pricing.taxAmount)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatINR(pricing.total)}</Text>
        </View>
        <View style={styles.footer} fixed>
          <Text>{data.branding.companyName}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Payment Schedule */}
      {data.paymentSchedule.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionLabel}>Payment Plan</Text>
          <Text style={styles.sectionTitle}>Schedule</Text>
          {data.paymentSchedule.map((m) => (
            <View key={m.id} style={{ ...styles.row, paddingVertical: 10 }} wrap={false}>
              <View>
                <Text style={{ fontSize: 11 }}>{m.name}</Text>
                <Text style={{ fontSize: 8, color: "#888888" }}>{m.description}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 8, color: "#c9a962" }}>{m.percentage}%</Text>
                <Text style={{ fontSize: 12 }}>{formatINR(m.amount)}</Text>
              </View>
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>{data.branding.companyName}</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* Terms */}
      {data.terms.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionLabel}>Important Information</Text>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          {data.terms.map((term, i) => (
            <View key={term.id} wrap={false}>
              <Text style={styles.termTitle}>{i + 1}. {term.title}</Text>
              <Text style={styles.termContent}>{term.content}</Text>
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>{data.branding.companyName}</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* Thank You */}
      <Page size="A4" style={{ ...styles.page, backgroundColor: "#1a1a1a" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, color: "#ffffff", marginBottom: 16 }}>Thank You</Text>
          <Text style={{ fontSize: 10, color: "#aaaaaa", textAlign: "center", lineHeight: 1.6, maxWidth: 400 }}>{data.thankYouMessage}</Text>
          <View style={{ marginTop: 30, alignItems: "center" }}>
            {data.branding.companyName && <Text style={{ fontSize: 9, color: "#888888" }}>{data.branding.companyName}</Text>}
            {data.branding.phone && <Text style={{ fontSize: 9, color: "#888888", marginTop: 4 }}>{data.branding.phone}</Text>}
            {data.branding.email && <Text style={{ fontSize: 9, color: "#888888", marginTop: 4 }}>{data.branding.email}</Text>}
          </View>
          {data.dates.validUntil && (
            <Text style={{ fontSize: 7, color: "#666666", marginTop: 20 }}>Valid until {formatPdfDate(data.dates.validUntil)}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
