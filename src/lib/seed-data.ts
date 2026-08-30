import type { QuotationData, ServiceTemplate, DeliverableTemplate, AlbumTemplate, TermTemplate } from "@/types/quotation";
import { generateId } from "@/lib/utils";

export const DEFAULT_BRAND = {
  logo: null,
  companyName: "Studio Name",
  tagline: "Wedding Photography & Films",
  phone: "+91 98765 43210",
  email: "hello@studio.com",
  website: "www.studio.com",
  instagram: "@studio",
  primaryColor: "#1a1a1a",
  secondaryColor: "#8b7355",
  accentColor: "#c9a962",
  fontHeading: "Cormorant Garamond",
  fontBody: "Inter",
  images: {
    heroImage: null,
    secondaryImages: [],
    venueImage: null,
  },
};

export const DEFAULT_TERMS: Omit<TermTemplate, "id">[] = [
  {
    title: "Booking & Payment",
    content:
      "A booking advance of 30% of the total quotation amount is required to confirm the booking. The balance payment schedule will be as mentioned in the payment schedule section. All payments are non-refundable unless otherwise stated.",
    category: "payments",
    sortOrder: 1,
    isDefault: true,
    active: true,
  },
  {
    title: "GST",
    content:
      "All prices quoted are exclusive of GST unless stated otherwise. Applicable GST will be charged as per government regulations at the time of invoicing.",
    category: "payments",
    sortOrder: 2,
    isDefault: true,
    active: true,
  },
  {
    title: "Cancellation Policy",
    content:
      "In case of cancellation by the client, the booking advance is non-refundable. If cancellation is made within 30 days of the wedding date, 100% of the total quotation amount becomes payable.",
    category: "cancellation",
    sortOrder: 3,
    isDefault: true,
    active: true,
  },
  {
    title: "Postponement & Rescheduling",
    content:
      "Postponement requests must be communicated in writing. Rescheduling is subject to team availability and may incur additional charges. One postponement may be accommodated without penalty if notified at least 60 days in advance.",
    category: "rescheduling",
    sortOrder: 4,
    isDefault: true,
    active: true,
  },
  {
    title: "Travel & Accommodation",
    content:
      "Travel and accommodation for the photography and videography team for events outside the city limits shall be borne by the client. This includes transportation, meals, and suitable accommodation for all team members.",
    category: "travel",
    sortOrder: 5,
    isDefault: true,
    active: true,
  },
  {
    title: "Accommodation Requirements",
    content:
      "The client shall provide comfortable accommodation for the team members covering all event days and one day prior/post the main events. Separate rooms for each team member are preferred.",
    category: "accommodation",
    sortOrder: 6,
    isDefault: true,
    active: true,
  },
  {
    title: "Deliverables & Timelines",
    content:
      "Edited photos will be delivered within 45-60 days from the last event date. Wedding films and highlight videos will be delivered within 90-120 days. Teaser videos will be delivered within 30 days.",
    category: "deliverables",
    sortOrder: 7,
    isDefault: true,
    active: true,
  },
  {
    title: "Album Revisions",
    content:
      "Two rounds of album design revisions are included. Additional revisions will be charged separately. Album printing will commence only after final approval of the design.",
    category: "albums",
    sortOrder: 8,
    isDefault: true,
    active: true,
  },
  {
    title: "Raw Data & SSD",
    content:
      "Raw footage and unedited photos are not part of the deliverables unless specifically mentioned. Raw data may be provided on an SSD provided by the client or purchased separately at additional cost.",
    category: "raw_data",
    sortOrder: 9,
    isDefault: true,
    active: true,
  },
  {
    title: "Live Streaming",
    content:
      "Live streaming services require stable high-speed internet connectivity at the venue, to be arranged by the client. Any disruption due to network issues is not the responsibility of the studio.",
    category: "deliverables",
    sortOrder: 10,
    isDefault: true,
    active: true,
  },
  {
    title: "Post Production",
    content:
      "All editing, color grading, and post-production work is performed in-house. The studio retains creative freedom in editing style while honoring client preferences discussed during pre-wedding consultations.",
    category: "post_production",
    sortOrder: 11,
    isDefault: true,
    active: true,
  },
  {
    title: "Data Retention",
    content:
      "All project data including raw files, edited files, and project files will be retained for a period of 6 months from the date of final delivery. After this period, data may be permanently deleted without notice.",
    category: "data_retention",
    sortOrder: 12,
    isDefault: true,
    active: true,
  },
];

export const SEED_SERVICES: Omit<ServiceTemplate, "id">[] = [
  { name: "Candid Photographer", category: "photography", description: "Documentary-style candid photography", image: null, unit: "photographer", defaultPrice: 25000, defaultDeliverables: [], active: true },
  { name: "Traditional Photographer", category: "photography", description: "Traditional posed photography coverage", image: null, unit: "photographer", defaultPrice: 20000, defaultDeliverables: [], active: true },
  { name: "Cinematic Videographer", category: "videography", description: "Cinematic film-style videography", image: null, unit: "videographer", defaultPrice: 35000, defaultDeliverables: [], active: true },
  { name: "Traditional Videographer", category: "videography", description: "Traditional event videography", image: null, unit: "videographer", defaultPrice: 25000, defaultDeliverables: [], active: true },
  { name: "Drone", category: "special", description: "Aerial drone coverage", image: null, unit: "unit", defaultPrice: 15000, defaultDeliverables: [], active: true },
  { name: "Live Streaming", category: "special", description: "Live event streaming for remote guests", image: null, unit: "unit", defaultPrice: 20000, defaultDeliverables: [], active: true },
];

export const SEED_DELIVERABLES: Omit<DeliverableTemplate, "id">[] = [
  { name: "Complete Event Edited Video", description: "Full edited coverage of the event", image: null, category: "video", active: true },
  { name: "Cinematic Wedding Film", description: "Cinematic highlight film of your wedding", image: null, category: "video", active: true },
  { name: "Edited Photos", description: "Professionally edited photo collection", image: null, category: "photo", active: true },
  { name: "Teaser Video", description: "Short teaser video for social sharing", image: null, category: "video", active: true },
  { name: "Raw Photos", description: "Unedited raw photo files", image: null, category: "photo", active: true },
  { name: "Traditional Edited Video", description: "Traditional style edited video", image: null, category: "video", active: true },
  { name: "Highlight Video", description: "Event highlight reel", image: null, category: "video", active: true },
];

export const SEED_ALBUMS: Omit<AlbumTemplate, "id">[] = [
  { name: "Premium Quality Customized Leather Album", albumType: "premium", description: "Handcrafted leather album with premium print quality", image: null, size: "12x36", sheets: 35, defaultPrice: 45000, active: true },
];

export function createEmptyQuotationData(): QuotationData {
  const today = new Date().toISOString().split("T")[0];
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return {
    client: {
      brideName: "",
      groomName: "",
      displayName: "",
      phone: "",
      email: "",
      location: "",
      notes: "",
    },
    dates: {
      startDate: "",
      endDate: "",
      proposalDate: today,
      validUntil,
    },
    branding: { ...DEFAULT_BRAND, images: { ...DEFAULT_BRAND.images } },
    template: "luxury",
    events: [],
    globalServices: [],
    globalDeliverables: [],
    albums: [],
    addons: [],
    discount: { type: "fixed", value: 0, label: "Discount" },
    tax: { enabled: true, rate: 18, label: "GST", inclusive: false },
    paymentSchedule: [
      { id: generateId(), name: "Booking", percentage: 30, amount: 0, dueDate: "", description: "Booking advance to confirm dates" },
      { id: generateId(), name: "Wedding Day", percentage: 60, amount: 0, dueDate: "", description: "Payable on or before the wedding day" },
      { id: generateId(), name: "Final Delivery", percentage: 10, amount: 0, dueDate: "", description: "Payable upon final delivery of all deliverables" },
    ],
    terms: DEFAULT_TERMS.map((t, i) => ({ ...t, id: generateId(), sortOrder: i + 1 })),
    welcomeMessage: "We are honored to present this proposal for your wedding celebration. Every moment of your special day deserves to be captured with artistry, passion, and precision.",
    thankYouMessage: "Thank you for considering us to be part of your wedding journey. We look forward to creating timeless memories together.",
  };
}

export function createSampleQuotationData(): QuotationData {
  const data = createEmptyQuotationData();

  data.client = {
    brideName: "Sanghavi",
    groomName: "Mani Kiran",
    displayName: "Sanghavi & Mani Kiran",
    phone: "+91 98765 43210",
    email: "couple@example.com",
    location: "Hyderabad",
    notes: "",
  };

  data.dates = {
    startDate: "2025-04-02",
    endDate: "2025-04-16",
    proposalDate: "2025-03-01",
    validUntil: "2025-04-01",
  };

  data.events = [
    {
      id: generateId(),
      name: "Engagement",
      date: "2025-04-02",
      startTime: "18:00",
      endTime: "22:00",
      timeLabel: "Evening",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 0,
    },
    {
      id: generateId(),
      name: "Cocktail",
      date: "2025-04-12",
      startTime: "19:00",
      endTime: "23:00",
      timeLabel: "Evening",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 1,
    },
    {
      id: generateId(),
      name: "Haldi",
      date: "2025-04-13",
      startTime: "09:00",
      endTime: "12:00",
      timeLabel: "Morning",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 2,
    },
    {
      id: generateId(),
      name: "Mehindi Function",
      date: "2025-04-13",
      startTime: "14:00",
      endTime: "20:00",
      timeLabel: "Afternoon",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 3,
    },
    {
      id: generateId(),
      name: "Wedding",
      date: "2025-04-13",
      startTime: "06:00",
      endTime: "14:00",
      timeLabel: "Morning",
      location: "Hyderabad",
      description: "Main wedding ceremony",
      image: null,
      services: [
        { id: generateId(), name: "Candid Photographer", quantity: 2, unitPrice: 25000, category: "photography" },
        { id: generateId(), name: "Traditional Photographer", quantity: 1, unitPrice: 20000, category: "photography" },
        { id: generateId(), name: "Cinematic Videographer", quantity: 1, unitPrice: 35000, category: "videography" },
        { id: generateId(), name: "Traditional Videographer", quantity: 1, unitPrice: 25000, category: "videography" },
        { id: generateId(), name: "Drone", quantity: 1, unitPrice: 15000, category: "special" },
        { id: generateId(), name: "Live Streaming", quantity: 1, unitPrice: 20000, category: "special" },
      ],
      deliverables: [],
      notes: "",
      sortOrder: 4,
    },
    {
      id: generateId(),
      name: "Bharaath",
      date: "2025-04-13",
      startTime: "08:00",
      endTime: "10:00",
      timeLabel: "Morning",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 5,
    },
    {
      id: generateId(),
      name: "Reception",
      date: "2025-04-16",
      startTime: "19:00",
      endTime: "23:00",
      timeLabel: "Evening",
      location: "Hyderabad",
      description: "",
      image: null,
      services: [],
      deliverables: [],
      notes: "",
      sortOrder: 6,
    },
  ];

  data.globalDeliverables = [
    { id: generateId(), name: "Edited Photos", description: "500+ professionally edited photos", image: null, category: "photo", quantity: "500+", duration: "", notes: "", global: true },
    { id: generateId(), name: "Cinematic Wedding Film", description: "Cinematic highlight film", image: null, category: "video", quantity: "1", duration: "5-8 min", notes: "", global: true },
    { id: generateId(), name: "Complete Event Edited Video", description: "Full event coverage videos", image: null, category: "video", quantity: "All Events", duration: "", notes: "", global: true },
    { id: generateId(), name: "Teaser Video", description: "Social media teaser", image: null, category: "video", quantity: "1", duration: "60 sec", notes: "", global: true },
  ];

  data.albums = [
    {
      id: generateId(),
      name: "Premium Quality Customized Leather Album",
      albumType: "premium",
      coverImage: null,
      size: "12x36",
      sheets: 35,
      quantity: 2,
      unitPrice: 45000,
      description: "35 + 35 Sheets — Premium leather customized albums",
      isParent: true,
    },
  ];

  data.discount = { type: "fixed", value: 0, label: "Discount" };
  data.tax = { enabled: true, rate: 18, label: "GST", inclusive: false };

  return data;
}
