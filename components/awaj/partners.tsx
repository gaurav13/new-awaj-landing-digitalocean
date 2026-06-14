const INSTITUTIONS = [
  "Cabinet Office, Government of Japan",
  "METI · Ministry of Economy, Trade and Industry",
  "JETRO · Japan External Trade Organization",
  "MIC · Ministry of Internal Affairs and Communications",
  "JICA · Japan International Cooperation Agency",
  "Tokyo Metropolitan Government",
]

const STRATEGIC = ["Ripple", "SBI Group", "MUFG", "Microsoft", "AWS", "Google Cloud", "And Many More"]

function Tier({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="mb-7 text-center">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">{label}</h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {items.map((p) => (
          <span
            key={p}
            className="text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55 transition-colors hover:text-gold"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Partners() {
  return (
    <section id="partners" className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
      <div className="rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm md:px-10">
        <Tier label="Supported by Leading Institutions" items={INSTITUTIONS} />
        <div className="mx-auto my-10 h-px w-full max-w-3xl bg-gold/20" />
        <Tier label="Strategic Ecosystem Partners" items={STRATEGIC} />
      </div>
    </section>
  )
}
