import type {
  AlbumItem,
  AddonItem,
  DiscountConfig,
  LineItem,
  PricingLineGroup,
  PricingSummary,
  QuotationData,
  TaxConfig,
} from "@/types/quotation";

function lineTotal(item: { quantity: number; unitPrice: number; included?: boolean; optional?: boolean }): number {
  if (item.included) return 0;
  return item.quantity * item.unitPrice;
}

function groupLineItems(items: LineItem[], category: string): PricingLineGroup {
  const priced = items
    .filter((item) => !item.included)
    .map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: lineTotal(item),
    }));

  return {
    category,
    items: priced,
    subtotal: priced.reduce((sum, item) => sum + item.total, 0),
  };
}

export function calculateDiscount(subtotal: number, discount: DiscountConfig): number {
  if (discount.value <= 0) return 0;
  if (discount.type === "percentage") {
    return Math.round((subtotal * discount.value) / 100);
  }
  return Math.min(discount.value, subtotal);
}

export function calculateTax(amount: number, tax: TaxConfig): number {
  if (!tax.enabled || tax.rate <= 0) return 0;
  if (tax.inclusive) {
    return Math.round(amount - amount / (1 + tax.rate / 100));
  }
  return Math.round((amount * tax.rate) / 100);
}

export function calculatePricing(data: QuotationData): PricingSummary {
  const groups: PricingLineGroup[] = [];

  const eventServices: LineItem[] = data.events.flatMap((event) =>
    event.services.map((s) => ({ ...s, name: `${s.name}`, category: s.category || event.name }))
  );

  const photography = groupLineItems(
    [...eventServices, ...data.globalServices].filter(
      (s) => s.category === "photography" || s.category?.toLowerCase().includes("photograph")
    ),
    "Photography"
  );
  if (photography.items.length) groups.push(photography);

  const videography = groupLineItems(
    [...eventServices, ...data.globalServices].filter(
      (s) => s.category === "videography" || s.category?.toLowerCase().includes("video")
    ),
    "Videography"
  );
  if (videography.items.length) groups.push(videography);

  const special = groupLineItems(
    [...eventServices, ...data.globalServices].filter(
      (s) => s.category === "special" || s.category === "special_services"
    ),
    "Special Services"
  );
  if (special.items.length) groups.push(special);

  const otherServices = groupLineItems(
    [...eventServices, ...data.globalServices].filter(
      (s) =>
        !["photography", "videography", "special", "special_services"].includes(s.category || "") &&
        !s.category?.toLowerCase().includes("photograph") &&
        !s.category?.toLowerCase().includes("video")
    ),
    "Services"
  );
  if (otherServices.items.length) groups.push(otherServices);

  const albumItems: LineItem[] = data.albums.map((album: AlbumItem) => ({
    id: album.id,
    name: album.name,
    quantity: album.quantity,
    unitPrice: album.unitPrice,
    category: "albums",
  }));
  const albums = groupLineItems(albumItems, "Albums");
  if (albums.items.length) groups.push(albums);

  const addonItems: LineItem[] = data.addons
    .filter((a: AddonItem) => !a.included)
    .map((addon: AddonItem) => ({
      id: addon.id,
      name: addon.name,
      quantity: addon.quantity,
      unitPrice: addon.price,
      category: "addons",
    }));
  const addons = groupLineItems(addonItems, "Add-ons");
  if (addons.items.length) groups.push(addons);

  const subtotal = groups.reduce((sum, g) => sum + g.subtotal, 0);
  const discountAmount = calculateDiscount(subtotal, data.discount);
  const afterDiscount = subtotal - discountAmount;

  let taxableAmount = afterDiscount;
  let taxAmount = 0;

  if (data.tax.enabled) {
    if (data.tax.inclusive) {
      taxAmount = calculateTax(afterDiscount, data.tax);
      taxableAmount = afterDiscount;
    } else {
      taxAmount = calculateTax(afterDiscount, data.tax);
      taxableAmount = afterDiscount;
    }
  }

  const total = data.tax.enabled && !data.tax.inclusive ? afterDiscount + taxAmount : afterDiscount;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
    lineItems: groups,
  };
}

export function calculatePaymentAmounts(
  total: number,
  milestones: { id: string; percentage: number }[]
): { id: string; amount: number }[] {
  return milestones.map((m) => ({
    id: m.id,
    amount: Math.round((total * m.percentage) / 100),
  }));
}

export function validatePaymentSchedule(milestones: { percentage: number }[]): {
  valid: boolean;
  total: number;
} {
  const total = milestones.reduce((sum, m) => sum + m.percentage, 0);
  return { valid: total === 100, total };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
