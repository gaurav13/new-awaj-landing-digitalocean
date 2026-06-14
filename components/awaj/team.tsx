import { getAllTeam } from "@/app/actions/team"

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

export async function Team() {
  const members = await getAllTeam()
  if (members.length === 0) return null

  return (
    <section id="team" className="border-t border-gold/15 bg-beige/40">
      <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our People</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">
            Meet the Team
          </h2>
          <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <article
              key={m.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden bg-beige">
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl || "/placeholder.svg"}
                    alt={`Portrait of ${m.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-gold/40">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-base font-bold leading-snug text-navy-text">{m.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold">{m.role}</p>
                {m.company && <p className="mt-0.5 text-xs font-medium text-navy-text/70">{m.company}</p>}
                {m.bio && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-navy-text/65">{m.bio}</p>}
                {m.linkedinUrl && (
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-navy-text/70 transition-colors hover:text-gold"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
