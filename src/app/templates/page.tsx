import type { ProposalTheme } from "@/types/quotation";

const THEMES: { id: ProposalTheme; label: string; description: string }[] = [
  { id: "luxury", label: "Luxury", description: "Warm gold accents, elegant serif typography" },
  { id: "editorial", label: "Editorial", description: "Bold, magazine-inspired layout" },
  { id: "classic", label: "Classic", description: "Timeless, refined aesthetic" },
  { id: "modern", label: "Modern", description: "Clean lines, contemporary feel" },
  { id: "minimal", label: "Minimal", description: "Understated, whitespace-focused" },
  { id: "traditional", label: "Traditional", description: "Rich, cultural warmth" },
];

export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-heading text-3xl mb-2">Proposal Templates</h1>
      <p className="text-sm text-muted-foreground mb-10">Choose a theme when building your proposal. Each theme renders the same data differently.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map((theme) => (
          <div key={theme.id} className={`proposal-theme-${theme.id} border border-border bg-card overflow-hidden group hover:border-accent transition-colors`}>
            <div className="aspect-[3/4] bg-[var(--theme-bg)] p-8 flex flex-col items-center justify-center">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-accent)] mb-4">Preview</p>
              <p className="font-heading text-2xl text-[var(--theme-text)]">{theme.label}</p>
              <div className="my-4 h-px w-12 bg-[var(--theme-accent)]" />
              <p className="text-xs text-[var(--theme-text)] opacity-60 tracking-wider uppercase">Sample Couple</p>
            </div>
            <div className="p-5 border-t border-border">
              <h3 className="font-heading text-lg">{theme.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
