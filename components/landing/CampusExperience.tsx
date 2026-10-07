"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, CornerDownRight } from "lucide-react";

const blocks = [
  { x: 125, y: 205, w: 120, d: 72, h: 54 },
  { x: 315, y: 115, w: 125, d: 70, h: 78 },
  { x: 502, y: 198, w: 96, d: 72, h: 50 },
  { x: 318, y: 295, w: 148, d: 80, h: 48 },
  { x: 122, y: 375, w: 95, d: 64, h: 36 },
];

/** Deterministic diagram: campus architecture below a useful workspace plane. */
function CampusTopology() {
  return (
    <svg viewBox="0 0 760 560" className="topology-drawing" aria-hidden="true">
      <defs><pattern id="campus-grid" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .42 -1 .42 380 -50)"><path d="M 36 0 L 0 0 0 36" fill="none" stroke="currentColor" strokeWidth=".7" /></pattern></defs>
      <path className="topology-foundation" d="M35 290 375 110 725 290 385 480Z" />
      <path className="topology-foundation-edge" d="M35 290 385 480 725 290V306L385 498 35 306Z" />
      <rect width="760" height="540" fill="url(#campus-grid)" className="topology-grid" />
      <g transform="translate(5 -15)">
        <path className="topology-path" d="M100 320 290 220 530 343 650 280M290 220 400 160M390 272 258 342" />
        <path className="topology-route" d="M100 320 290 220 390 272 258 342" />
        {blocks.map(({ x, y, w, d, h }) => (
          <g key={x + ":" + y} className="topology-building">
            <path className="topology-side" d={`M${x} ${y}l${w} ${w * .48}v${h}l${-w} ${-w * .48}Z`} />
            <path className="topology-front" d={`M${x + w} ${y + w * .48}l${d} ${-d * .48}v${h}l${-d} ${d * .48}Z`} />
            <path className="topology-roof" d={`M${x} ${y}l${d} ${-d * .48} ${w} ${w * .48} ${-d} ${d * .48}Z`} />
            <path className="topology-roof-line" d={`M${x + 15} ${y}l${d - 30} ${-(d - 30) * .48} ${w - 30} ${(w - 30) * .48} ${-(d - 30)} ${(d - 30) * .48}Z`} />
          </g>
        ))}
        <circle className="topology-node" cx="100" cy="320" r="5" /><circle className="topology-node" cx="258" cy="342" r="5" />
      </g>
      <path className="topology-registration" d="M48 160v-18h18M681 421h18v-18M48 405v18h18M681 143h18v18" />
    </svg>
  );
}

export function CampusExperience() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    let inView = false;
    const sync = () => { scene.dataset.motion = inView && !document.hidden ? "running" : "paused"; };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(scene);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 65, damping: 25 });
  const rotateX = useSpring(pointerY, { stiffness: 65, damping: 25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 45]);
  return (
    <section ref={ref} className="spatial-hero" data-motion="paused" aria-labelledby="campus-headline"
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 5);
        pointerY.set(((event.clientY - rect.top) / rect.height - .5) * -4);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
      <div className="spatial-hero-copy">
        <p className="spatial-hero-intro">University life, in one place.</p>
        <h1 id="campus-headline">Your campus.<br />Connected.</h1>
        <p className="spatial-hero-description">From your next class to your next community.<br className="spatial-desktop-break" /> A workspace for everything that makes campus yours.</p>
        <Link href="/dashboard" className="spatial-enter">Enter CampusOS <ArrowUpRight size={20} aria-hidden="true" /></Link>
        <p className="spatial-entry-note">Sign in or create your student account.</p>
      </div>
      <motion.figure className="spatial-campus" style={reduce ? undefined : { rotateX, rotateY, y }}>
        <CampusTopology />
        <div className="spatial-schedule">
          <div className="spatial-schedule-header"><span>Your day, at a glance</span><span>Sample</span></div>
          <div className="spatial-schedule-event"><time>09:00</time><div><strong>Data Structures</strong><span>Lecture · Academic block</span></div><span className="spatial-schedule-dot" aria-hidden="true" /></div>
          <div className="spatial-schedule-event"><time>11:30</time><div><strong>Design workshop</strong><span>Community · Student centre</span></div></div>
          <div className="spatial-schedule-footer"><CornerDownRight size={14} aria-hidden="true" /><span>One view. A little more headspace.</span></div>
        </div>
        <figcaption><span>Campus, connected to your day.</span><span>Concept topology / Sample schedule</span></figcaption>
      </motion.figure>
      <div className="spatial-hero-baseline"><span>RBU CampusOS</span><span>Academics, communities, places.</span><span aria-hidden="true">↓</span></div>
    </section>
  );
}
