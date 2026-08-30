export type QuotationStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired";

export type ProposalTheme =
  | "luxury"
  | "editorial"
  | "classic"
  | "modern"
  | "minimal"
  | "traditional";

export type ServiceCategory =
  | "photography"
  | "videography"
  | "special"
  | "pre_post_wedding"
  | "albums"
  | "other";

export type TermCategory =
  | "payments"
  | "cancellation"
  | "rescheduling"
  | "travel"
  | "accommodation"
  | "deliverables"
  | "albums"
  | "raw_data"
  | "post_production"
  | "data_retention"
  | "other";

export interface ClientInfo {
  brideName: string;
  groomName: string;
  displayName: string;
  phone: string;
  email: string;
  location: string;
  notes: string;
}

export interface QuotationDates {
  startDate: string;
  endDate: string;
  proposalDate: string;
  validUntil: string;
}

export interface BrandingImages {
  heroImage: string | null;
  secondaryImages: string[];
  venueImage: string | null;
}

export interface Branding {
  logo: string | null;
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  images: BrandingImages;
}

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  serviceId?: string;
  eventId?: string;
  optional?: boolean;
  included?: boolean;
}

export interface QuotationEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  location: string;
  description: string;
  image: string | null;
  services: LineItem[];
  deliverables: DeliverableItem[];
  notes: string;
  sortOrder: number;
}

export interface DeliverableItem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  category: string;
  quantity: string;
  duration: string;
  notes: string;
  eventId?: string;
  serviceId?: string;
  global?: boolean;
}

export interface AlbumItem {
  id: string;
  name: string;
  albumType: string;
  coverImage: string | null;
  size: string;
  sheets: number;
  quantity: number;
  unitPrice: number;
  description: string;
  isParent?: boolean;
  extraSheetPrice?: number;
}

export interface AddonItem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  quantity: number;
  optional: boolean;
  included: boolean;
}

export interface DiscountConfig {
  type: "fixed" | "percentage";
  value: number;
  label: string;
}

export interface TaxConfig {
  enabled: boolean;
  rate: number;
  label: string;
  inclusive: boolean;
}

export interface PricingSummary {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
  lineItems: PricingLineGroup[];
}

export interface PricingLineGroup {
  category: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
}

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  description: string;
}

export interface TermItem {
  id: string;
  title: string;
  content: string;
  category: TermCategory;
  sortOrder: number;
}

export interface QuotationData {
  client: ClientInfo;
  dates: QuotationDates;
  branding: Branding;
  template: ProposalTheme;
  events: QuotationEvent[];
  globalServices: LineItem[];
  globalDeliverables: DeliverableItem[];
  albums: AlbumItem[];
  addons: AddonItem[];
  discount: DiscountConfig;
  tax: TaxConfig;
  paymentSchedule: PaymentMilestone[];
  terms: TermItem[];
  welcomeMessage: string;
  thankYouMessage: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  status: QuotationStatus;
  version: number;
  parentId?: string | null;
  data: QuotationData;
  pricing: PricingSummary;
  createdAt: string;
  updatedAt: string;
  sentAt?: string | null;
  viewedAt?: string | null;
  acceptedAt?: string | null;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  image: string | null;
  unit: string;
  defaultPrice: number;
  defaultDeliverables: string[];
  active: boolean;
}

export interface DeliverableTemplate {
  id: string;
  name: string;
  description: string;
  image: string | null;
  category: string;
  active: boolean;
}

export interface AlbumTemplate {
  id: string;
  name: string;
  albumType: string;
  description: string;
  image: string | null;
  size: string;
  sheets: number;
  defaultPrice: number;
  active: boolean;
}

export interface TermTemplate {
  id: string;
  title: string;
  content: string;
  category: TermCategory;
  sortOrder: number;
  isDefault: boolean;
  active: boolean;
}

export type BuilderStep =
  | "client"
  | "events"
  | "services"
  | "deliverables"
  | "albums"
  | "addons"
  | "pricing"
  | "payment"
  | "terms"
  | "design"
  | "review";

export const BUILDER_STEPS: { id: BuilderStep; label: string; number: number }[] = [
  { id: "client", label: "Client", number: 1 },
  { id: "events", label: "Events", number: 2 },
  { id: "services", label: "Services", number: 3 },
  { id: "deliverables", label: "Deliverables", number: 4 },
  { id: "albums", label: "Albums", number: 5 },
  { id: "addons", label: "Add-ons", number: 6 },
  { id: "pricing", label: "Pricing", number: 7 },
  { id: "payment", label: "Payment", number: 8 },
  { id: "terms", label: "Terms", number: 9 },
  { id: "design", label: "Design", number: 10 },
  { id: "review", label: "Review", number: 11 },
];
