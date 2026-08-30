"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Package,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quotations", label: "Quotations", icon: FileText },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/deliverables", label: "Deliverables", icon: Package },
  { href: "/albums", label: "Albums", icon: BookOpen },
  { href: "/settings/branding", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isBuilder = pathname.includes("/edit");
  const isClientView = pathname.includes("/client-view");

  if (isBuilder || isClientView) return null;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-heading text-lg tracking-wide">Propose</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/quotations/new"
          className="flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          + Create Quotation
        </Link>
      </div>
    </aside>
  );
}
