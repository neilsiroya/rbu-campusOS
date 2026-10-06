"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, BookOpen, CalendarDays, MapPin } from "lucide-react";

/** The scene is a visual entrance. Navigation remains keyboard-accessible DOM. */
export function CampusExperience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 65, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 65, damping: 25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.15]);
  return (
    <section ref={ref} className="campus-experience" aria-labelledby="campus-headline"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        pointerX.set(((e.clientX - r.left) / r.width - .5) * -16);
        pointerY.set(((e.clientY - r.top) / r.height - .5) * -10);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
      <motion.div className="campus-scene-image" style={reduce ? undefined : { x, y, scale }} aria-hidden="true">
        <Image src="/images/campus-courtyard.webp" alt="" fill priority sizes="100vw" quality={85} />
      </motion.div>
      <div className="campus-scene-shade" aria-hidden="true" />
      <div className="campus-scene-content">
        <div className="campus-scene-topline"><span>Ramdeobaba University</span><span>Nagpur, India</span></div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.16, 1, .3, 1] }}>
          <h1 id="campus-headline">ONE CAMPUS.<br />ONE IDENTITY.<br />EVERY EXPERIENCE.</h1>
          <p className="campus-scene-description">The life around your degree.<br />Your people, your places, your next possibility.</p>
          <Link href="/dashboard" className="campus-enter">Enter CampusOS <ArrowUpRight className="size-5" aria-hidden="true" /></Link>
        </motion.div>
        <div className="campus-scene-bottom"><a href="#explore-campus" className="inline-flex min-h-11 items-center gap-3">Explore your campus <ArrowDown className="size-4" /></a><span>Campus-inspired concept artwork</span></div>
      </div>
      <nav className="campus-scene-places" aria-label="Explore campus spaces">
        <Link href="/notes" className="campus-place campus-place-library"><BookOpen className="size-4" /><span>Study together<small>Notes & resources</small></span><ArrowUpRight className="size-4" /></Link>
        <Link href="/events" className="campus-place campus-place-events"><CalendarDays className="size-4" /><span>After class<small>Events & communities</small></span><ArrowUpRight className="size-4" /></Link>
        <Link href="/map" className="campus-place campus-place-map"><MapPin className="size-4" /><span>Find your way<small>Campus directory</small></span><ArrowUpRight className="size-4" /></Link>
      </nav>
    </section>
  );
}
