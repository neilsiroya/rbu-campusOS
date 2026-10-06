import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/os/BrandMark";
import { CampusExperience } from "@/components/landing/CampusExperience";
import { EVENTS, CLUBS, STUDY_RESOURCES } from "@/lib/campus-data";

const destinations = [
  { title: "Make the week yours.", text: "Classes, assignments, attendance. A little clarity for everything ahead.", href: "/academics", label: "Academics", detail: "Timetable · Assignments · Exams" },
  { title: "Find your people.", text: "The conversation after class. The club you didn't know you needed. Your community, closer.", href: "/feed", label: "Community", detail: "Feed · Clubs · People" },
  { title: "Go beyond the classroom.", text: "A first internship, your next hackathon, or something happening right here on campus.", href: "/internships", label: "Opportunities", detail: "Internships · Hackathons · Placements" },
];
export default function Home() {
  return (
    <main className="campus-landing">
      <header className="landing-nav">
        <BrandMark href="/" />
        <nav aria-label="Main navigation" className="flex items-center gap-5 sm:gap-8">
          <a href="#explore-campus" className="hidden text-sm sm:inline-flex">Explore</a>
          <Link href="/auth/login" className="text-sm">Log in</Link>
          <Link href="/dashboard" className="landing-launch">Open CampusOS <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </nav>
      </header>
      <CampusExperience />
      <section id="explore-campus" className="landing-explore">
        <div className="landing-section-heading"><p>Life at RBU</p><h2>More than a place<br />to get a degree.</h2><p>One home for the things that make campus yours. Start with what matters to you.</p></div>
        <div className="landing-destinations">
          {destinations.map((d) => <Link href={d.href} key={d.href} className="landing-destination"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{d.label}</span><ArrowUpRight className="size-5" /></div><h3>{d.title}</h3><p>{d.text}</p><span className="destination-detail">{d.detail}</span></Link>)}
        </div>
      </section>
      <section className="landing-board" aria-labelledby="board-heading">
        <div><p className="text-sm text-muted-foreground">A glimpse inside</p><h2 id="board-heading">The campus<br />noticeboard.</h2><p className="mt-5 max-w-xs text-sm text-muted-foreground">Explore sample campus content. Sign in to use your workspace.</p><Link href="/dashboard" className="mt-8 inline-flex min-h-11 items-center gap-4 font-medium">Open your workspace <ArrowRight className="size-4" /></Link></div>
        <div className="landing-board-items">
          <Link href="/events"><span>What’s happening</span><h3>{EVENTS[0].title}</h3><p>{EVENTS[0].date} · {EVENTS[0].location}</p><ArrowUpRight /></Link>
          <Link href="/clubs"><span>Find your circle</span><h3>{CLUBS[0].name}</h3><p>{CLUBS[0].category} · {CLUBS[0].members} members in the demo</p><ArrowUpRight /></Link>
          <Link href="/notes"><span>Pass it on</span><h3>{STUDY_RESOURCES[0].title}</h3><p>{STUDY_RESOURCES[0].subject} · {STUDY_RESOURCES[0].type}</p><ArrowUpRight /></Link>
        </div>
      </section>
      <footer className="landing-footer"><BrandMark href="/" /><p>One campus. One identity. Every experience.</p><Link href="/auth/signup">Create an account <ArrowUpRight className="size-4" /></Link></footer>
    </main>
  );
}
