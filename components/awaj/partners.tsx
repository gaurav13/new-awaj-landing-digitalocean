const PARTNERS = [
  "JETRO",
  "PwC",
  "Yahoo! JAPAN",
  "SBI Group",
  "Mizuho",
  "NTT docomo",
  "Polkadot",
  "Polygon",
  "Oasys",
  "Animoca Brands",
]

export function Partners() {
  return (
    <section id="partners" className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
      <div className="rounded-3xl border border-gold/25 bg-white px-6 py-10 shadow-sm md:px-10">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-xl font-bold uppercase tracking-[0.2em] text-navy-text">Trusted Partners</h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="font-serif text-lg font-bold tracking-tight text-navy/50 transition-colors hover:text-gold"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
