import type { Quotation, ProposalTheme } from "@/types/quotation";
import { formatINR } from "@/lib/pricing";
import { formatDate, formatDateRange, cn } from "@/lib/utils";

interface ProposalRendererProps {
  quotation: Quotation;
  mode?: "preview" | "client" | "pdf";
  className?: string;
}

const themeClasses: Record<ProposalTheme, string> = {
  luxury: "proposal-theme-luxury",
  editorial: "proposal-theme-editorial",
  classic: "proposal-theme-classic",
  modern: "proposal-theme-modern",
  minimal: "proposal-theme-minimal",
  traditional: "proposal-theme-traditional",
};

export function ProposalRenderer({ quotation, mode = "preview", className }: ProposalRendererProps) {
  const { data, pricing } = quotation;
  const theme = data.template || "luxury";
  const isClient = mode === "client";

  return (
    <div
      className={cn(
        "proposal-scroll bg-[var(--theme-bg,#faf9f7)] text-[var(--theme-text,#1a1a1a)]",
        themeClasses[theme],
        isClient ? "min-h-screen" : "",
        className
      )}
      style={{
        "--theme-accent": data.branding.accentColor,
      } as React.CSSProperties}
    >
      {/* Cover */}
      <section className={cn("relative", isClient ? "min-h-screen" : "min-h-[600px]")}>
        {data.branding.images.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.branding.images.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-neutral-900" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex min-h-[inherit] flex-col items-center justify-center px-8 py-20 text-center text-white">
          {data.branding.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.branding.logo} alt="" className="mb-8 h-12 object-contain brightness-0 invert" />
          )}
          <p className="mb-4 text-xs tracking-[0.4em] uppercase opacity-80">
            {data.branding.tagline || "Wedding Photography & Films"}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light tracking-wide leading-tight">
            {data.client.displayName || "Your Names"}
          </h1>
          <div className="my-8 h-px w-16 bg-[var(--theme-accent,#c9a962)]" />
          <p className="text-sm tracking-[0.3em] uppercase opacity-90">
            {formatDateRange(data.dates.startDate, data.dates.endDate)}
          </p>
          {data.client.location && (
            <p className="mt-2 text-xs tracking-[0.25em] uppercase opacity-70">{data.client.location.toUpperCase()}</p>
          )}
        </div>
      </section>

      {/* Welcome */}
      <section className="px-8 py-20 md:px-16 md:py-28 max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-6">Welcome</p>
        <h2 className="font-heading text-3xl md:text-4xl mb-8 leading-relaxed">
          Your Wedding Story Begins Here
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {data.welcomeMessage}
        </p>
      </section>

      {/* Timeline / Events */}
      {data.events.length > 0 && (
        <section className="px-8 py-16 md:px-16 md:py-24 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4 text-center">Your Journey</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-16 text-center">Wedding Events</h2>
            <div className="space-y-12">
              {data.events.map((event, index) => (
                <article key={event.id} className="grid md:grid-cols-2 gap-8 items-start">
                  <div className={cn("order-2", index % 2 === 1 && "md:order-1")}>
                    {event.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={event.image} alt="" className="w-full aspect-[4/3] object-cover" />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm tracking-widest uppercase">{event.name}</span>
                      </div>
                    )}
                  </div>
                  <div className={cn("order-1 flex flex-col justify-center", index % 2 === 1 && "md:order-2")}>
                    <p className="text-xs tracking-[0.2em] uppercase text-[var(--theme-accent)] mb-2">
                      {formatDate(event.date, { day: "numeric", month: "long", year: "numeric" })}
                      {event.timeLabel && ` · ${event.timeLabel}`}
                    </p>
                    <h3 className="font-heading text-2xl md:text-3xl mb-4">{event.name}</h3>
                    {event.location && <p className="text-sm text-muted-foreground mb-4">{event.location}</p>}
                    {event.description && <p className="text-sm leading-relaxed mb-6">{event.description}</p>}
                    {event.services.length > 0 && (
                      <div className="space-y-4">
                        {Object.entries(
                          event.services.reduce<Record<string, typeof event.services>>((acc, s) => {
                            const cat = s.category || "Services";
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(s);
                            return acc;
                          }, {})
                        ).map(([category, services]) => (
                          <div key={category}>
                            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2 capitalize">{category}</p>
                            <ul className="space-y-1">
                              {services.map((s) => (
                                <li key={s.id} className="text-sm">
                                  {s.quantity > 1 ? `${s.quantity} ` : ""}{s.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables */}
      {data.globalDeliverables.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4 text-center">What You Receive</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-16 text-center">Deliverables</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.globalDeliverables.map((d) => (
                <div key={d.id} className="text-center p-8 border border-border bg-card">
                  {d.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.image} alt="" className="w-16 h-16 mx-auto mb-4 object-cover rounded-full" />
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted flex items-center justify-center">
                      <span className="font-heading text-2xl text-[var(--theme-accent)]">{d.quantity?.charAt(0) || "✦"}</span>
                    </div>
                  )}
                  <p className="text-xs tracking-wider uppercase text-[var(--theme-accent)] mb-2">{d.quantity}</p>
                  <h3 className="font-heading text-xl mb-3">{d.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Albums */}
      {data.albums.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4 text-center">Keepsakes</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-16 text-center">Albums</h2>
            <div className="space-y-8">
              {data.albums.map((album) => (
                <div key={album.id} className="flex flex-col md:flex-row gap-8 items-center border border-border bg-card p-8">
                  {album.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.coverImage} alt="" className="w-full md:w-48 aspect-square object-cover" />
                  ) : (
                    <div className="w-full md:w-48 aspect-square bg-muted flex items-center justify-center">
                      <span className="font-heading text-lg text-muted-foreground">Album</span>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-heading text-2xl mb-2">{album.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{album.description}</p>
                    <p className="text-xs tracking-wider uppercase text-muted-foreground">
                      {album.size} · {album.sheets} sheets · Qty: {album.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Investment */}
      <section className="px-8 py-20 md:px-16 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4">Investment</p>
          <h2 className="font-heading text-3xl md:text-4xl mb-12">Your Proposal</h2>

          <div className="text-left space-y-6 mb-12">
            {pricing.lineItems.map((group) => (
              <div key={group.category}>
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">{group.category}</p>
                {group.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm">
                      {item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                    <span className="text-sm tabular-nums">{formatINR(item.total)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatINR(pricing.subtotal)}</span>
            </div>
            {pricing.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>{data.discount.label || "Discount"}</span>
                <span className="tabular-nums">−{formatINR(pricing.discountAmount)}</span>
              </div>
            )}
            {data.tax.enabled && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{data.tax.label} ({data.tax.rate}%)</span>
                <span className="tabular-nums">{formatINR(pricing.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-border">
              <span className="font-heading text-xl">Total</span>
              <span className="font-heading text-2xl tabular-nums text-[var(--theme-accent)]">{formatINR(pricing.total)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Schedule */}
      {data.paymentSchedule.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28 bg-white/50">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4">Payment Plan</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-12">Schedule</h2>
            <div className="space-y-6">
              {data.paymentSchedule.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-6 border border-border bg-card">
                  <div className="text-left">
                    <p className="font-heading text-lg">{milestone.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                    {milestone.dueDate && (
                      <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(milestone.dueDate)}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-wider uppercase text-[var(--theme-accent)]">{milestone.percentage}%</p>
                    <p className="font-heading text-xl tabular-nums">{formatINR(milestone.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Terms */}
      {data.terms.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4 text-center">Important Information</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-12 text-center">Terms & Conditions</h2>
            <div className="space-y-8">
              {data.terms.map((term, i) => (
                <div key={term.id}>
                  <h3 className="font-heading text-lg mb-2">{i + 1}. {term.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{term.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Thank You / CTA */}
      <section className="px-8 py-20 md:px-16 md:py-28 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl mb-6">Thank You</h2>
          <p className="text-sm leading-relaxed opacity-80 mb-12">{data.thankYouMessage}</p>
          <div className="space-y-2 text-sm opacity-70">
            {data.branding.companyName && <p>{data.branding.companyName}</p>}
            {data.branding.phone && <p>{data.branding.phone}</p>}
            {data.branding.email && <p>{data.branding.email}</p>}
            {data.branding.website && <p>{data.branding.website}</p>}
          </div>
          {isClient && (
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[var(--theme-accent)] text-primary font-medium tracking-wide hover:opacity-90 transition-opacity">
                Accept Proposal
              </button>
              <button className="px-8 py-4 border border-primary-foreground/30 font-medium tracking-wide hover:bg-primary-foreground/10 transition-colors">
                Download PDF
              </button>
            </div>
          )}
          {data.dates.validUntil && (
            <p className="mt-8 text-xs opacity-50">
              Valid until {formatDate(data.dates.validUntil)}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
