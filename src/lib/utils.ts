import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `QT-${year}-${num}`;
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...options,
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function formatDateRange(start: string, end: string): string {
  if (!start) return "";
  if (!end || start === end) return formatDate(start, { day: "2-digit", month: "long", year: "numeric" });
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startDay = startDate.getDate().toString().padStart(2, "0");
  const endDay = endDate.getDate().toString().padStart(2, "0");
  const month = endDate.toLocaleDateString("en-IN", { month: "long" });
  const year = endDate.getFullYear();
  return `${startDay} — ${endDay} ${month.toUpperCase()} ${year}`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
