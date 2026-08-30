import { prisma, seedDatabase, serializeQuotation } from "@/lib/db";
import { createEmptyQuotationData } from "@/lib/seed-data";
import { calculatePricing, calculatePaymentAmounts } from "@/lib/pricing";
import { generateQuotationNumber } from "@/lib/utils";
import type { QuotationData } from "@/types/quotation";

let seeded = false;

async function ensureSeeded() {
  if (!seeded) {
    await seedDatabase();
    seeded = true;
  }
}

export async function getAllQuotations() {
  await ensureSeeded();
  const records = await prisma.quotation.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return records.map(serializeQuotation);
}

export async function getQuotation(id: string) {
  await ensureSeeded();
  const record = await prisma.quotation.findUnique({ where: { id } });
  if (!record) return null;
  return serializeQuotation(record);
}

export async function createQuotation(useSample = false) {
  await ensureSeeded();
  const { createSampleQuotationData } = await import("@/lib/seed-data");
  const data = useSample ? createSampleQuotationData() : createEmptyQuotationData();

  const brand = await prisma.brandSettings.findUnique({ where: { id: "default" } });
  if (brand) {
    data.branding = {
      ...data.branding,
      companyName: brand.companyName,
      tagline: brand.tagline,
      phone: brand.phone,
      email: brand.email,
      website: brand.website,
      instagram: brand.instagram,
      logo: brand.logo,
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColor,
      accentColor: brand.accentColor,
      fontHeading: brand.fontHeading,
      fontBody: brand.fontBody,
    };
  }

  const record = await prisma.quotation.create({
    data: {
      quotationNumber: generateQuotationNumber(),
      status: "draft",
      version: 1,
      data: JSON.stringify(data),
    },
  });
  return serializeQuotation(record);
}

export async function updateQuotation(id: string, data: QuotationData, status?: string) {
  await ensureSeeded();
  const pricing = calculatePricing(data);
  const paymentAmounts = calculatePaymentAmounts(pricing.total, data.paymentSchedule);
  const updatedData = {
    ...data,
    paymentSchedule: data.paymentSchedule.map((m) => ({
      ...m,
      amount: paymentAmounts.find((p) => p.id === m.id)?.amount ?? m.amount,
    })),
  };

  const record = await prisma.quotation.update({
    where: { id },
    data: {
      data: JSON.stringify(updatedData),
      ...(status ? { status } : {}),
      updatedAt: new Date(),
    },
  });
  return serializeQuotation(record);
}

export async function deleteQuotation(id: string) {
  await ensureSeeded();
  await prisma.quotation.delete({ where: { id } });
}

export async function duplicateQuotation(id: string) {
  await ensureSeeded();
  const original = await prisma.quotation.findUnique({ where: { id } });
  if (!original) throw new Error("Quotation not found");

  const record = await prisma.quotation.create({
    data: {
      quotationNumber: generateQuotationNumber(),
      status: "draft",
      version: 1,
      parentId: original.id,
      data: original.data,
    },
  });
  return serializeQuotation(record);
}

export async function updateQuotationStatus(id: string, status: string, timestampField?: string) {
  await ensureSeeded();
  const updateData: Record<string, unknown> = { status };
  if (timestampField) {
    updateData[timestampField] = new Date();
  }
  const record = await prisma.quotation.update({
    where: { id },
    data: updateData,
  });
  return serializeQuotation(record);
}

export async function getDashboardStats() {
  await ensureSeeded();
  const quotations = await prisma.quotation.findMany();
  const serialized = quotations.map(serializeQuotation);

  return {
    total: serialized.length,
    draft: serialized.filter((q) => q.status === "draft").length,
    sent: serialized.filter((q) => q.status === "sent").length,
    viewed: serialized.filter((q) => q.status === "viewed").length,
    accepted: serialized.filter((q) => q.status === "accepted").length,
    expired: serialized.filter((q) => q.status === "expired").length,
    recent: serialized.slice(0, 10),
  };
}

export async function getServiceTemplates() {
  await ensureSeeded();
  const services = await prisma.serviceTemplate.findMany({ where: { active: true } });
  return services.map((s) => ({
    ...s,
    defaultDeliverables: JSON.parse(s.defaultDeliverables),
  }));
}

export async function getDeliverableTemplates() {
  await ensureSeeded();
  return prisma.deliverableTemplate.findMany({ where: { active: true } });
}

export async function getAlbumTemplates() {
  await ensureSeeded();
  return prisma.albumTemplate.findMany({ where: { active: true } });
}

export async function getTermTemplates() {
  await ensureSeeded();
  return prisma.termTemplate.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getBrandSettings() {
  await ensureSeeded();
  return prisma.brandSettings.findUnique({ where: { id: "default" } });
}

export async function updateBrandSettings(data: Record<string, unknown>) {
  await ensureSeeded();
  return prisma.brandSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data } as Parameters<typeof prisma.brandSettings.create>[0]["data"],
  });
}
