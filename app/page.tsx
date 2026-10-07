import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/os/BrandMark";
import { CampusExperience } from "@/components/landing/CampusExperience";
import "./landing-spatial.css";

const destinations = [
  { title: "Keep your week in view.", text: "Your timetable, assignments and exams, together in one academic workspace.", href: "/academics", label: "Academics", tags: "Timetable / Assignments / Exams" },
  { title: "Something worth showing up for.", text: "Discover campus events and save a place in your plans.", href: "/events", label: "Campus events", tags: "Workshops / Cultural events / Meetups" },
  { title: "Meet your kind of people.", text: "Find student communities built around the things you care about.", href: "/clubs", label: "Clubs & communities", tags: "Technology / Culture / Sport" },
  { title: "Know where you're going.", text: "Explore buildings and facilities through the campus directory.", href: "/map", label: "Campus map", tags: "Buildings / Facilities / Places" },
];

export default function Home() {
  return (
    <main className="spatial-landing">
      <header className="spatial-nav">
        <BrandMark href="/" className="spatial-brand" />
        <span className="spatial-nav-context">Ramdeobaba University, Nagpur</span>
        <a href="#campus-directory" className="spatial-nav-link">Discover the workspace <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>
      <CampusExperience />
      <section id="campus-directory" className="spatial-directory" aria-labelledby="directory-heading">
        <div className="spatial-directory-heading">
          <p>Inside CampusOS</p>
          <h2 id="directory-heading">Less searching.<br />More campus.</h2>
          <p>A shared home for the practical parts of university life, and everything that happens in between.</p>
        </div>
        <div className="spatial-directory-links">
          {destinations.map((destination) => (
            <Link href={destination.href} key={destination.href} className="spatial-directory-row">
              <span className="spatial-directory-label">{destination.label}</span>
              <div><h3>{destination.title}</h3><p>{destination.text}</p><span className="spatial-directory-tags">{destination.tags}</span></div>
              <ArrowUpRight className="spatial-directory-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <section className="spatial-product-note" aria-labelledby="product-note-heading">
        <h2 id="product-note-heading">A campus workspace,<br />taking shape.</h2>
        <p>Explore sample university content with a real account. Saved items and preferences stay in this browser session while campus integrations are being built.</p>
      </section>
      <footer className="spatial-footer"><BrandMark href="/" /><p>Built around life at RBU.</p><span>Student project · Sample campus data</span></footer>
    </main>
  );
}
