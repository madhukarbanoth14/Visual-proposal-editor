import { PrismaClient } from "@prisma/client";
import {
  SEED_SERVICES,
  SEED_DELIVERABLES,
  SEED_ALBUMS,
  DEFAULT_TERMS,
  DEFAULT_BRAND,
  createSampleQuotationData,
} from "./seed-data";
import type { QuotationStatus } from "@/types/quotation";
import { calculatePricing, calculatePaymentAmounts } from "./pricing";
import { generateId, generateQuotationNumber } from "./utils";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function seedDatabase() {
  const serviceCount = await prisma.serviceTemplate.count();
  if (serviceCount === 0) {
    await prisma.serviceTemplate.createMany({
      data: SEED_SERVICES.map((s) => ({
        ...s,
        defaultDeliverables: JSON.stringify(s.defaultDeliverables),
      })),
    });
  }

  const deliverableCount = await prisma.deliverableTemplate.count();
  if (deliverableCount === 0) {
    await prisma.deliverableTemplate.createMany({ data: SEED_DELIVERABLES });
  }

  const albumCount = await prisma.albumTemplate.count();
  if (albumCount === 0) {
    await prisma.albumTemplate.createMany({ data: SEED_ALBUMS });
  }

  const termCount = await prisma.termTemplate.count();
  if (termCount === 0) {
    await prisma.termTemplate.createMany({ data: DEFAULT_TERMS });
  }

  const brand = await prisma.brandSettings.findUnique({ where: { id: "default" } });
  if (!brand) {
    const { companyName, tagline, phone, email, website, instagram, logo, primaryColor, secondaryColor, accentColor, fontHeading, fontBody } = DEFAULT_BRAND;
    await prisma.brandSettings.create({
      data: { id: "default", companyName, tagline, phone, email, website, instagram, logo, primaryColor, secondaryColor, accentColor, fontHeading, fontBody },
    });
  }

  const quotationCount = await prisma.quotation.count();
  if (quotationCount === 0) {
    const sampleData = createSampleQuotationData();
    const pricing = calculatePricing(sampleData);
    const total = 550000;
    sampleData.paymentSchedule = sampleData.paymentSchedule.map((m) => ({
      ...m,
      amount: Math.round((total * m.percentage) / 100),
    }));

    await prisma.quotation.create({
      data: {
        quotationNumber: generateQuotationNumber(),
        status: "draft",
        version: 1,
        data: JSON.stringify({ ...sampleData, _pricingOverride: total }),
      },
    });
  }
}

export function parseQuotationData(json: string) {
  return JSON.parse(json);
}

export function serializeQuotation(record: {
  id: string;
  quotationNumber: string;
  status: string;
  version: number;
  parentId: string | null;
  data: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt: Date | null;
  viewedAt: Date | null;
  acceptedAt: Date | null;
}) {
  const data = parseQuotationData(record.data);
  const pricing = calculatePricing(data);

  if (data._pricingOverride) {
    pricing.total = data._pricingOverride;
    pricing.subtotal = Math.round(data._pricingOverride / (1 + (data.tax?.rate || 0) / 100));
    pricing.taxAmount = data._pricingOverride - pricing.subtotal;
  }

  const paymentAmounts = calculatePaymentAmounts(pricing.total, data.paymentSchedule || []);
  if (data.paymentSchedule) {
    data.paymentSchedule = data.paymentSchedule.map((m: { id: string; percentage: number }) => ({
      ...m,
      amount: paymentAmounts.find((p) => p.id === m.id)?.amount ?? m.amount,
    }));
  }

  return {
    id: record.id,
    quotationNumber: record.quotationNumber,
    status: record.status as QuotationStatus,
    version: record.version,
    parentId: record.parentId,
    data,
    pricing,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    sentAt: record.sentAt?.toISOString() ?? null,
    viewedAt: record.viewedAt?.toISOString() ?? null,
    acceptedAt: record.acceptedAt?.toISOString() ?? null,
  };
}
