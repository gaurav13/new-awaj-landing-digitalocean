import { Header } from "@/components/awaj/header"
import { Hero } from "@/components/awaj/hero"
import { Stats } from "@/components/awaj/stats"
import { Programs } from "@/components/awaj/programs"
import { EventsNews } from "@/components/awaj/events-news"
import { Offerings } from "@/components/awaj/offerings"
import { Team } from "@/components/awaj/team"
import { Partners } from "@/components/awaj/partners"
import { Footer } from "@/components/awaj/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-ivory">
      <Header />
      <Hero />
      <Stats />
      <Programs />
      <EventsNews />
      <Offerings />
      <Team />
      <Partners />
      <Footer />
    </main>
  )
}
