import type { Person } from "@/app/actions/people"

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

export function ConnectedPeople({
  people,
  title = "People",
  subtitle,
}: {
  people: Person[]
  title?: string
  subtitle?: string
}) {
  if (people.length === 0) return null

  return (
    <section className="border-t border-gold/20 bg-ivory">
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-text md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-navy-text/65">{subtitle}</p> : null}
          <div className="mt-3 h-px w-16 bg-gold/60" />
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {people.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden bg-beige">
                {p.profilePhoto ? (
                  <img
                    src={p.profilePhoto || "/placeholder.svg"}
                    alt={`Portrait of ${p.fullName}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-gold/40">
                    {p.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-base font-bold leading-snug text-navy-text">{p.fullName}</h3>
                {p.jobTitle ? <p className="mt-1 text-xs font-medium text-navy-text/70">{p.jobTitle}</p> : null}
                {p.showCompanyLogo && p.companyLogo ? (
                  <img
                    src={p.companyLogo || "/placeholder.svg"}
                    alt={p.companyName ? `${p.companyName} logo` : "Company logo"}
                    className="mt-2 max-h-6 w-auto max-w-[110px] object-contain"
                  />
                ) : p.companyName ? (
                  <p className="mt-1 text-xs font-semibold text-gold">{p.companyName}</p>
                ) : null}
                {p.bio ? <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-navy-text/65">{p.bio}</p> : null}
                {p.showLinkedin && p.linkedinUrl ? (
                  <a
                    href={p.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-text/70 transition-colors hover:text-gold"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
