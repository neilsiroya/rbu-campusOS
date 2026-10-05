export const DEMO_NOTICE =
  "Demo campus data for product development. Not live university records.";

export const SESSION_NOTICE =
  "Actions stay on this device for the current browser session. Nothing is saved to CampusOS servers yet.";

export const CURRENT_STUDENT = {
  name: "Student User",
  id: "RBU-2026-042",
  branch: "Computer Science & Engineering",
  year: "3rd Year",
  level: 12,
  xp: 1840,
  maxXp: 2400,
  rank: 124,
  streak: 7,
};

export type FeedCategory =
  | "Campus"
  | "Announcement"
  | "Event"
  | "Club"
  | "Question"
  | "Achievement"
  | "Anonymous";

export type FeedPost = {
  id: string;
  author: string;
  handle: string;
  anonymous: boolean;
  category: FeedCategory;
  body: string;
  createdAt: string;
  reactions: { like: number; fire: number; insightful: number };
  comments: { id: string; author: string; anonymous: boolean; body: string; createdAt: string }[];
  sessionLocal?: boolean;
};

export const FEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    author: "Campus Desk",
    handle: "campusdesk",
    anonymous: false,
    category: "Announcement",
    body: "Library Wing B closes at 6pm today for electrical work. Central reading hall stays open until 10.",
    createdAt: "2026-09-08T08:10:00+05:30",
    reactions: { like: 42, fire: 6, insightful: 18 },
    comments: [
      { id: "c1", author: "Meera K.", anonymous: false, body: "Thanks — I had a group booked there.", createdAt: "2026-09-08T08:22:00+05:30" },
    ],
  },
  {
    id: "p2",
    author: "Aryan Sharma",
    handle: "aryan.s",
    anonymous: false,
    category: "Club",
    body: "Robotics Society is running late-night soldering hours in Lab-4. Extra boards available if you're building for the symposium.",
    createdAt: "2026-09-08T07:40:00+05:30",
    reactions: { like: 67, fire: 21, insightful: 9 },
    comments: [
      { id: "c2", author: "Priya Das", anonymous: false, body: "Bringing two juniors. Save a bench?", createdAt: "2026-09-08T07:55:00+05:30" },
    ],
  },
  {
    id: "p3",
    author: "Anonymous",
    handle: "anon",
    anonymous: true,
    category: "Anonymous",
    body: "Whoever left jasmine tea in the CSE corridor — that was the nicest 8am of this semester.",
    createdAt: "2026-09-08T06:12:00+05:30",
    reactions: { like: 128, fire: 14, insightful: 3 },
    comments: [],
  },
  {
    id: "p4",
    author: "Events",
    handle: "events",
    anonymous: false,
    category: "Event",
    body: "Annual Tech Symposium registrations close Friday. Keynote is in the Main Auditorium — not the plaza this year.",
    createdAt: "2026-09-07T21:05:00+05:30",
    reactions: { like: 90, fire: 33, insightful: 12 },
    comments: [],
  },
  {
    id: "p5",
    author: "Neha V.",
    handle: "neha.v",
    anonymous: false,
    category: "Question",
    body: "Is the campus shuttle still skipping Gate 3 after 9pm, or did that change this week?",
    createdAt: "2026-09-07T19:44:00+05:30",
    reactions: { like: 19, fire: 1, insightful: 27 },
    comments: [
      { id: "c3", author: "Transport Desk", anonymous: false, body: "Gate 3 stop is back from today. Last shuttle 10:40pm.", createdAt: "2026-09-07T20:02:00+05:30" },
    ],
  },
  {
    id: "p6",
    author: "Kevin Rose",
    handle: "kevin",
    anonymous: false,
    category: "Achievement",
    body: "City Hack 2026 — RBU team placed 2nd. Project write-up is going up in the Coding Club hall tomorrow.",
    createdAt: "2026-09-07T16:18:00+05:30",
    reactions: { like: 210, fire: 88, insightful: 15 },
    comments: [],
  },
];

export type ConfessionCategory = "Campus" | "Academics" | "Hostel" | "Canteen" | "Unsent" | "Wholesome";

export type Confession = {
  id: string;
  alias: string;
  category: ConfessionCategory;
  body: string;
  createdAt: string;
  reactions: { relate: number; hug: number; wild: number };
  replies: { id: string; alias: string; body: string; createdAt: string }[];
  sessionLocal?: boolean;
};

export const CONFESSIONS: Confession[] = [
  {
    id: "cf1",
    alias: "Midnight Ink",
    category: "Unsent",
    body: "I still take the long way past the amphitheatre because that’s where we used to wait after labs.",
    createdAt: "2026-09-08T01:14:00+05:30",
    reactions: { relate: 94, hug: 41, wild: 4 },
    replies: [{ id: "r1", alias: "Quiet Bench", body: "Same path. Same excuse.", createdAt: "2026-09-08T01:40:00+05:30" }],
  },
  {
    id: "cf2",
    alias: "Lab Ghost",
    category: "Academics",
    body: "I understood OS paging at 3am and immediately forgot it at 9am in the same room.",
    createdAt: "2026-09-07T22:33:00+05:30",
    reactions: { relate: 180, hug: 22, wild: 11 },
    replies: [],
  },
  {
    id: "cf3",
    alias: "Canteen Oracle",
    category: "Canteen",
    body: "The Maggi at Block C after 8pm is a personality test. If you wait, you belong here.",
    createdAt: "2026-09-07T20:05:00+05:30",
    reactions: { relate: 76, hug: 9, wild: 38 },
    replies: [],
  },
  {
    id: "cf4",
    alias: "North Wing",
    category: "Hostel",
    body: "To the person who keeps watering the corridor plants: the floor is thriving. We see you.",
    createdAt: "2026-09-07T11:20:00+05:30",
    reactions: { relate: 52, hug: 63, wild: 2 },
    replies: [],
  },
  {
    id: "cf5",
    alias: "Quad Shadow",
    category: "Campus",
    body: "Fest season makes the campus feel like a city that only exists for two weeks. I already miss it and it hasn’t started.",
    createdAt: "2026-09-06T18:48:00+05:30",
    reactions: { relate: 121, hug: 30, wild: 8 },
    replies: [],
  },
];

export const ALIASES = [
  "Midnight Ink",
  "Lab Ghost",
  "Quad Shadow",
  "North Wing",
  "Canteen Oracle",
  "Rain Corridor",
  "Library Owl",
  "Gate Three",
];

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "Club" | "Cultural" | "Technical" | "Workshop" | "Competition";
  club?: string;
  featured?: boolean;
};

export const EVENTS: CampusEvent[] = [
  {
    id: "e1",
    title: "Annual Tech Symposium",
    description: "Talks, demos, and a night market of student projects. Keynote in the Main Auditorium.",
    date: "20 Sep",
    time: "10:00",
    location: "Main Auditorium",
    category: "Technical",
    featured: true,
  },
  {
    id: "e2",
    title: "Fusion Night",
    description: "Music and dance societies share one stage. Open lawn seating from 5:30pm.",
    date: "22 Sep",
    time: "18:00",
    location: "Campus Plaza",
    category: "Cultural",
    club: "Cultural Collective",
  },
  {
    id: "e3",
    title: "ROS2 Workshop",
    description: "Hands-on navigation stacks for the symposium robots. Bring a laptop.",
    date: "12 Sep",
    time: "14:00",
    location: "Lab-4",
    category: "Workshop",
    club: "Robotics Society",
  },
  {
    id: "e4",
    title: "Intra-college Debate",
    description: "Motion drops 24 hours before. Prelims in LT-101.",
    date: "16 Sep",
    time: "16:30",
    location: "LT-101",
    category: "Competition",
    club: "Debate Society",
  },
  {
    id: "e5",
    title: "Club Fair",
    description: "Every registered club on the quad. Join desks, merch, and first-meeting times.",
    date: "12 Sep",
    time: "11:00",
    location: "Central Quad",
    category: "Club",
  },
  {
    id: "e6",
    title: "Design Sprint",
    description: "48-hour product studio hosted with the Entrepreneurship Cell.",
    date: "18 Sep",
    time: "09:00",
    location: "Innovation Hall",
    category: "Competition",
    club: "E-Cell",
  },
];

export type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  nextEvent: string;
  hall: string;
};

export const CLUBS: Club[] = [
  { id: "cl1", name: "Robotics Society", category: "Technical", description: "Builds, breaks, and rebuilds machines that move. Lab-4 is home.", members: 186, nextEvent: "ROS2 Workshop · 12 Sep", hall: "Lab-4" },
  { id: "cl2", name: "Coding Club", category: "Technical", description: "Contests, reading groups, and late-night debugging that somehow becomes tradition.", members: 240, nextEvent: "Hack night · Fri 8pm", hall: "CS Block" },
  { id: "cl3", name: "Cultural Collective", category: "Arts", description: "Music, dance, theatre, and the people who make fest nights feel inevitable.", members: 310, nextEvent: "Fusion Night · 22 Sep", hall: "Amphitheatre" },
  { id: "cl4", name: "Debate Society", category: "Literary", description: "Arguments with structure. Also the best tea in the humanities corridor.", members: 92, nextEvent: "Intra debate · 16 Sep", hall: "LT-101" },
  { id: "cl5", name: "E-Cell", category: "Career", description: "Founders-in-progress, pitch nights, and people who collect domain names.", members: 154, nextEvent: "Design Sprint · 18 Sep", hall: "Innovation Hall" },
  { id: "cl6", name: "Photography Club", category: "Arts", description: "Golden hour at Gate 2. Rain at the library steps. Campus, documented.", members: 88, nextEvent: "Photo walk · Sun 6am", hall: "Media Room" },
];

export type Person = {
  id: string;
  name: string;
  branch: string;
  year: string;
  interests: string[];
  clubs: string[];
};

export const PEOPLE: Person[] = [
  { id: "u1", name: "Aryan Sharma", branch: "CSE", year: "3rd", interests: ["Robotics", "Systems"], clubs: ["Robotics Society"] },
  { id: "u2", name: "Priya Das", branch: "CSE", year: "3rd", interests: ["AI", "Design"], clubs: ["Coding Club", "E-Cell"] },
  { id: "u3", name: "Meera Kulkarni", branch: "ECE", year: "2nd", interests: ["Music", "Embedded"], clubs: ["Cultural Collective"] },
  { id: "u4", name: "Kevin Rose", branch: "CSE", year: "4th", interests: ["Hackathons", "Product"], clubs: ["Coding Club"] },
  { id: "u5", name: "Neha Verma", branch: "Civil", year: "3rd", interests: ["Campus life", "Photography"], clubs: ["Photography Club"] },
  { id: "u6", name: "Rohan Iyer", branch: "ME", year: "2nd", interests: ["Debate", "Policy"], clubs: ["Debate Society"] },
];

export type LostFoundItem = {
  id: string;
  kind: "lost" | "found";
  title: string;
  location: string;
  date: string;
  category: "ID" | "Electronics" | "Books" | "Apparel" | "Other";
  description: string;
  status: "Open" | "Claimed";
  sessionLocal?: boolean;
};

export const LOST_FOUND: LostFoundItem[] = [
  { id: "lf1", kind: "lost", title: "Navy hoodie, Robotics patch", location: "Lab-4 corridor", date: "7 Sep", category: "Apparel", description: "Left on a bench after soldering hours. Size M.", status: "Open" },
  { id: "lf2", kind: "found", title: "ID card — first name Aisha", location: "Library steps", date: "8 Sep", category: "ID", description: "Found near the railing after rain. Handed to library desk conceptually.", status: "Open" },
  { id: "lf3", kind: "found", title: "Black wireless earbuds case", location: "Canteen Block C", date: "6 Sep", category: "Electronics", description: "Case only, no buds. With the cashier until evening.", status: "Open" },
  { id: "lf4", kind: "lost", title: "Discrete Maths notebook", location: "LT-101", date: "5 Sep", category: "Books", description: "Blue spiral, name on first page.", status: "Open" },
];

export type MapPlace = {
  id: string;
  name: string;
  kind: "Academic" | "Lab" | "Facility" | "Service" | "Social";
  x: number;
  y: number;
  w: number;
  h: number;
  note: string;
};

export const MAP_PLACES: MapPlace[] = [
  { id: "admin", name: "Admin Block", kind: "Service", x: 8, y: 10, w: 18, h: 14, note: "Registrar, certificates, ID desk" },
  { id: "lt", name: "Lecture Theatres", kind: "Academic", x: 30, y: 8, w: 28, h: 16, note: "LT-101 to LT-204" },
  { id: "cs", name: "CS Block", kind: "Academic", x: 62, y: 10, w: 22, h: 18, note: "Faculty, seminar rooms" },
  { id: "lab4", name: "Lab-4", kind: "Lab", x: 62, y: 32, w: 16, h: 12, note: "Robotics & systems lab" },
  { id: "lib", name: "Library", kind: "Facility", x: 30, y: 30, w: 24, h: 16, note: "Reading halls, archives" },
  { id: "quad", name: "Central Quad", kind: "Social", x: 28, y: 50, w: 30, h: 14, note: "Club fair, informal gatherings" },
  { id: "plaza", name: "Campus Plaza", kind: "Social", x: 8, y: 52, w: 16, h: 16, note: "Fusion Night lawn" },
  { id: "aud", name: "Auditorium", kind: "Facility", x: 62, y: 52, w: 22, h: 16, note: "Symposium, town halls" },
  { id: "sport", name: "Sports Complex", kind: "Facility", x: 8, y: 74, w: 26, h: 16, note: "Courts, track, indoor hall" },
  { id: "cafe", name: "Canteen C", kind: "Facility", x: 40, y: 74, w: 20, h: 14, note: "Late Maggi, tea, notice board" },
  { id: "med", name: "Health Centre", kind: "Service", x: 66, y: 74, w: 18, h: 14, note: "First aid, counselling hours" },
];

export type Facility = {
  id: string;
  name: string;
  category: string;
  hours: string;
  location: string;
  note: string;
};

export const FACILITIES: Facility[] = [
  { id: "f1", name: "Central Library", category: "Library", hours: "8:00–22:00", location: "Library Block", note: "Wing B shorter hours today in demo calendar." },
  { id: "f2", name: "Lab-4 Robotics", category: "Labs", hours: "9:00–21:00", location: "CS Block rear", note: "Access via society or course booking." },
  { id: "f3", name: "Main Auditorium", category: "Auditoriums", hours: "Event-based", location: "East campus", note: "Symposium venue this month." },
  { id: "f4", name: "Sports Complex", category: "Sports", hours: "6:00–21:00", location: "South lawn", note: "Court bookings at the desk." },
  { id: "f5", name: "Canteen Block C", category: "Cafeterias", hours: "8:00–22:30", location: "South spine", note: "Peak 1–2pm and after 8pm." },
  { id: "f6", name: "Health Centre", category: "Medical", hours: "9:00–17:00", location: "Near Gate 2", note: "Emergency contact posted at the door." },
  { id: "f7", name: "LT Cluster", category: "Classrooms", hours: "8:00–18:00", location: "Academic core", note: "LT-101 through LT-204." },
  { id: "f8", name: "Innovation Hall", category: "Labs", hours: "10:00–20:00", location: "E-Cell wing", note: "Sprint space, whiteboards, power." },
];

export type CampusService = {
  id: string;
  name: string;
  category: string;
  contact: string;
  hours: string;
  note: string;
};

export const SERVICES: CampusService[] = [
  { id: "s1", name: "Registrar", category: "Administration", contact: "Admin Block · Desk 2", hours: "10:00–16:00", note: "Transcripts, enrolment letters." },
  { id: "s2", name: "Student Support", category: "Support", contact: "Student Union", hours: "10:00–17:00", note: "Grievances, mentoring, quiet room." },
  { id: "s3", name: "Campus Transport", category: "Transport", contact: "Gate 1 booth", hours: "7:00–22:40", note: "Gate 3 stop restored in demo notice." },
  { id: "s4", name: "Maintenance", category: "Maintenance", contact: "Works desk", hours: "9:00–18:00", note: "Electrical, plumbing, furniture." },
  { id: "s5", name: "Library Desk", category: "Library", contact: "Library foyer", hours: "8:00–20:00", note: "Holds, lost cards, visitor passes." },
  { id: "s6", name: "IT Helpdesk", category: "IT", contact: "CS Block G02", hours: "9:30–17:30", note: "Wi-Fi, LMS, campus mail." },
];

export type TimetableEntry = {
  day: string;
  time: string;
  title: string;
  room: string;
  kind: string;
};

export const TIMETABLE: TimetableEntry[] = [
  { day: "Mon", time: "09:00–10:00", title: "Engineering Mechanics", room: "LT-101", kind: "Lecture" },
  { day: "Mon", time: "11:00–13:00", title: "Robotics Lab", room: "Lab-4", kind: "Lab" },
  { day: "Mon", time: "14:00–15:00", title: "AI Fundamentals", room: "LT-204", kind: "Lecture" },
  { day: "Tue", time: "10:00–11:00", title: "Discrete Mathematics", room: "LT-101", kind: "Lecture" },
  { day: "Tue", time: "14:00–16:00", title: "Operating Systems", room: "LT-204", kind: "Lecture" },
  { day: "Wed", time: "09:00–10:00", title: "Technical Communication", room: "Room 402", kind: "Lecture" },
  { day: "Wed", time: "14:00–16:00", title: "Distributed Systems Lab", room: "Lab-3", kind: "Lab" },
  { day: "Thu", time: "11:00–12:00", title: "AI Fundamentals", room: "LT-204", kind: "Lecture" },
  { day: "Fri", time: "09:00–10:00", title: "Discrete Mathematics", room: "LT-101", kind: "Lecture" },
  { day: "Fri", time: "16:30–18:00", title: "Robotics Society", room: "Student Union", kind: "Club" },
];

export type AttendanceItem = {
  code: string;
  name: string;
  percent: number;
  present: number;
  total: number;
};

export const ATTENDANCE: AttendanceItem[] = [
  { code: "CS301", name: "Advanced OS", percent: 88, present: 22, total: 25 },
  { code: "CS302", name: "Distributed Systems", percent: 76, present: 19, total: 25 },
  { code: "MA204", name: "Discrete Mathematics", percent: 92, present: 23, total: 25 },
  { code: "HU101", name: "Technical Communication", percent: 84, present: 21, total: 25 },
];

export type Assignment = {
  id: string;
  subject: string;
  title: string;
  due: string;
  status: "urgent" | "pending";
};

export const ASSIGNMENTS: Assignment[] = [
  { id: "a1", subject: "OS", title: "Kernel notes set", due: "12 Sep", status: "urgent" as const },
  { id: "a2", subject: "DistSys", title: "Paxos reading response", due: "15 Sep", status: "pending" as const },
  { id: "a3", subject: "Maths", title: "Graph theory problem set", due: "18 Sep", status: "pending" as const },
  { id: "a4", subject: "AI", title: "Perceptron notebook", due: "22 Sep", status: "pending" as const },
];

export const EXAMS = [
  { id: "x1", subject: "Operating Systems", date: "04 Oct", slot: "10:00–13:00", room: "LT-204", prep: "Paging, scheduling, sync." },
  { id: "x2", subject: "Distributed Systems", date: "07 Oct", slot: "10:00–13:00", room: "LT-101", prep: "Consensus, replication." },
  { id: "x3", subject: "Discrete Mathematics", date: "10 Oct", slot: "14:00–17:00", room: "LT-101", prep: "Graphs, counting." },
];

export const INTERNSHIPS = [
  { id: "i1", title: "Software intern", org: "Aperture Labs (demo)", close: "20 Sep", type: "Summer" },
  { id: "i2", title: "Embedded intern", org: "Northwind Robotics (demo)", close: "28 Sep", type: "Winter" },
  { id: "i3", title: "Product intern", org: "Campus startups desk", close: "15 Oct", type: "Part-time" },
];

export const HACKATHONS = [
  { id: "h1", title: "City Hack 2026", when: "10–12 Sep", where: "Innovation Hall", prize: "Showcase + mentorship" },
  { id: "h2", title: "Campus Clash", when: "02 Oct", where: "CS Block", prize: "Club credits" },
  { id: "h3", title: "Design Sprint", when: "18 Sep", where: "E-Cell", prize: "Incubation desk time" },
];

export const PLACEMENTS = [
  { id: "pl1", company: "Northwind (demo)", role: "Graduate engineer", deadline: "25 Sep", stage: "Applications" },
  { id: "pl2", company: "Aperture (demo)", role: "SDE intern conversion", deadline: "30 Sep", stage: "Shortlist" },
  { id: "pl3", company: "Campus research cell", role: "RA — systems", deadline: "12 Oct", stage: "Rolling" },
];

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Symposium reminder", body: "Registrations close Friday.", href: "/events", time: "2h", unread: true },
  { id: "n2", title: "Lost & Found", body: "A navy hoodie was listed near Lab-4.", href: "/lost-found", time: "5h", unread: true },
  { id: "n3", title: "Marketplace update", body: "New bike rental posted near Gate 2.", href: "/marketplace", time: "6h", unread: true },
  { id: "n4", title: "Study Hub pulse", body: "BEE exam PYQs trending in knowledge network.", href: "/notes", time: "7h", unread: true },
  { id: "n5", title: "Club fair", body: "Robotics Society posted soldering hours.", href: "/feed", time: "8h", unread: false },
  { id: "n6", title: "Library hours", body: "Wing B closes early today.", href: "/facilities", time: "1d", unread: false },
];

export const AI_STARTERS = [
  "Where is Lab-4 from the library?",
  "What’s happening on campus this week?",
  "Is anyone renting a bike or selling gear?",
  "Show me study material for BEE and OS.",
  "Which clubs meet on Friday?",
  "When is my next class in the demo timetable?",
  "Any open lost & found listings?",
];

export type MarketplaceListing = {
  id: string;
  title: string;
  type: "For Sale" | "For Rent" | "Free" | "Lend / Borrow";
  category: "Electronics" | "Vehicles" | "Books" | "Study" | "Fashion" | "Sports" | "Projects" | "Hostel" | "Miscellaneous";
  price: number;
  pricingUnit: string;
  condition: "New" | "Like new" | "Good" | "Used";
  location: string;
  seller: string;
  availability: string;
  posted: string;
  description: string;
  accent: string;
  sessionLocal?: boolean;
};

export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: "m1",
    title: "Casio FX-991EX ClassWiz Calculator",
    type: "For Sale",
    category: "Study",
    price: 850,
    pricingUnit: "one-time",
    condition: "Like new",
    location: "Library steps",
    seller: "Riya M. (ECE 3rd Yr)",
    availability: "Available today",
    posted: "42m ago",
    description: "Genuine scientific matrix calculator with protective slide cover. Essential for engineering math and BEE papers.",
    accent: "from-blue-600/80 to-cyan-500/40",
  },
  {
    id: "m2",
    title: "Hero Sprint 7-Speed City Bicycle",
    type: "For Rent",
    category: "Vehicles",
    price: 250,
    pricingUnit: "/ day",
    condition: "Good",
    location: "Gate 2 cycle stand",
    seller: "Arjun P. (CSE 4th Yr)",
    availability: "Weekdays & weekends",
    posted: "1h ago",
    description: "Campus-to-station commuter bike with numeric combination lock, bottle cage and LED safety light. Student ID verification on exchange.",
    accent: "from-emerald-600/80 to-teal-400/40",
  },
  {
    id: "m3",
    title: "BEE & Signals PYQ Paper Sets (2021-25)",
    type: "Free",
    category: "Books",
    price: 0,
    pricingUnit: "free",
    condition: "Good",
    location: "LT Cluster / Canteen C",
    seller: "Meera K. (ECE 2nd Yr)",
    availability: "Pick up after 4pm",
    posted: "2h ago",
    description: "Spiral-bound previous year question sets with handwritten margin notes and recurring topic markers.",
    accent: "from-amber-500/80 to-orange-400/40",
  },
  {
    id: "m4",
    title: "Aluminium Tripod & Smartphone Mount",
    type: "Lend / Borrow",
    category: "Electronics",
    price: 0,
    pricingUnit: "2 days max",
    condition: "Good",
    location: "Media Room / Central Quad",
    seller: "Photography Club",
    availability: "Return by Sunday 6pm",
    posted: "3h ago",
    description: "Sturdy travel tripod for project demo video filming, club walks or symposium presentation setups.",
    accent: "from-teal-600/80 to-emerald-400/40",
  },
  {
    id: "m5",
    title: "Arduino Uno R3 + Sensor Expansion Kit",
    type: "For Sale",
    category: "Projects",
    price: 1100,
    pricingUnit: "one-time",
    condition: "Good",
    location: "CS Block Lab-4",
    seller: "Kabir S. (Robotics Society)",
    availability: "Available all week",
    posted: "5h ago",
    description: "Uno board, ultrasonic sensors, servo motors, breadboard, jumper wire bundle, and 9V adapter. Perfect for robotics mini-projects.",
    accent: "from-cyan-600/80 to-blue-500/40",
  },
  {
    id: "m6",
    title: "Warm LED Study Lamp with USB Charger",
    type: "Free",
    category: "Hostel",
    price: 0,
    pricingUnit: "free",
    condition: "Used",
    location: "North Hostel Block B",
    seller: "Ananya D. (Civil 3rd Yr)",
    availability: "Before Friday",
    posted: "1d ago",
    description: "Dimmable warm desk lamp with flexible neck and 5V USB output. Moving hostel wings this weekend.",
    accent: "from-rose-500/80 to-pink-400/40",
  },
  {
    id: "m7",
    title: "Fastrack Smartwatch Active 2.0",
    type: "For Sale",
    category: "Electronics",
    price: 1400,
    pricingUnit: "one-time",
    condition: "Like new",
    location: "Sports Complex",
    seller: "Rohan I. (ME 2nd Yr)",
    availability: "Evenings after 5pm",
    posted: "1d ago",
    description: "Black silicone strap, 1.83-inch HD display, magnetic charging dock included. Barely used 2 months.",
    accent: "from-indigo-600/80 to-sky-400/40",
  },
  {
    id: "m8",
    title: "Engineering Graphics Mini-Drafter Kit",
    type: "For Sale",
    category: "Study",
    price: 450,
    pricingUnit: "one-time",
    condition: "Good",
    location: "LT-101 foyer",
    seller: "Priya Das (CSE 3rd Yr)",
    availability: "Immediate pick up",
    posted: "2d ago",
    description: "Stainless steel clamp mini-drafter with plastic carry case, set squares, and drafting clips.",
    accent: "from-teal-600/80 to-emerald-400/40",
  },
];

export type StudyResource = {
  id: string;
  title: string;
  subject: string;
  branch: string;
  year: string;
  type: "Lecture notes" | "Study guide" | "Previous-year paper" | "Lab manual" | "Cheat sheet" | "Project resource";
  uploader: string;
  posted: string;
  description: string;
  tags: string[];
  useful: number;
  popular?: boolean;
  sessionLocal?: boolean;
};

export const STUDY_RESOURCES: StudyResource[] = [
  {
    id: "r1",
    title: "Signals & Systems: Unit 2 Fourier & LTI Notes",
    subject: "Signals & Systems",
    branch: "ECE",
    year: "2nd",
    type: "Lecture notes",
    uploader: "Meera Kulkarni",
    posted: "Today",
    description: "Clean mathematical derivations for continuous and discrete Fourier transforms, LTI system responses, and solved class test problems.",
    tags: ["Fourier", "LTI Systems", "Mid-sem", "Derivations"],
    useful: 92,
    popular: true,
  },
  {
    id: "r2",
    title: "Basic Electrical Engineering (BEE) PYQ Map & Solutions",
    subject: "Basic Electrical Engineering",
    branch: "All",
    year: "1st",
    type: "Previous-year paper",
    uploader: "Ravi Agarwal",
    posted: "Yesterday",
    description: "5-year question bank (2021-25) organized by module weightage with step-by-step circuit theorems and AC analysis solutions.",
    tags: ["BEE", "PYQ", "AC Analysis", "Thevenin", "Revision"],
    useful: 148,
    popular: true,
  },
  {
    id: "r3",
    title: "Operating Systems: Concurrency & Synchronization Cheat Sheet",
    subject: "Operating Systems",
    branch: "CSE",
    year: "3rd",
    type: "Cheat sheet",
    uploader: "Priya Das",
    posted: "2d ago",
    description: "High-density summary of Mutex locks, Semaphores, Monitors, Dining Philosophers, Deadlock Banker's algorithm, and classic exam pitfalls.",
    tags: ["OS", "Sync", "Deadlock", "Bankers Algorithm", "Exam Prep"],
    useful: 78,
    popular: true,
  },
  {
    id: "r4",
    title: "Robotics Society Lab-4 Hardware & ROS2 Quickstart",
    subject: "Robotics & Embedded Systems",
    branch: "CSE",
    year: "3rd",
    type: "Lab manual",
    uploader: "Robotics Society",
    posted: "3d ago",
    description: "Lab-4 workbench safety etiquette, oscilloscope calibration, GPIO pinouts, and ROS2 Humble navigation stack setup guide.",
    tags: ["ROS2", "Robotics", "Lab-4", "Linux", "Hardware"],
    useful: 54,
  },
  {
    id: "r5",
    title: "Data Structures & Algorithms Complexity & Pattern Compendium",
    subject: "Data Structures & Algorithms",
    branch: "CSE",
    year: "2nd",
    type: "Study guide",
    uploader: "Coding Club",
    posted: "4d ago",
    description: "Visual tree traversals, dynamic programming states, two-pointer templates, and amortized time-complexity lookup table.",
    tags: ["DSA", "Trees", "DP", "Algorithms", "Coding"],
    useful: 116,
    popular: true,
  },
  {
    id: "r6",
    title: "Design Sprint & Product Ideation Research Canvas",
    subject: "Product Innovation & E-Cell",
    branch: "All",
    year: "All",
    type: "Project resource",
    uploader: "E-Cell",
    posted: "5d ago",
    description: "A structured 48-hour student sprint canvas for user interviews, rapid prototype wireframing, and demo pitch validation.",
    tags: ["E-Cell", "Product", "Sprint", "Research", "Pitch"],
    useful: 41,
  },
];

// --- Academic course catalog (single source; consumed by /academics) ---
export type Course = {
  code: string;
  name: string;
  instructor: string;
  progress: number;
  nextSession: {
    time: string;
    room: string;
  };
  status: "On Track" | "Behind" | "Completed";
  credits: number;
};

export const COURSES: Course[] = [
  {
    code: "CS301",
    name: "Advanced Operating Systems",
    instructor: "Dr. Sarah Chen",
    progress: 65,
    nextSession: { time: "Tomorrow, 10:00", room: "LT-204" },
    status: "On Track",
    credits: 4,
  },
  {
    code: "CS302",
    name: "Distributed Systems",
    instructor: "Prof. Marcus Thorne",
    progress: 42,
    nextSession: { time: "Wednesday, 14:00", room: "Lab-3" },
    status: "Behind",
    credits: 4,
  },
  {
    code: "MA204",
    name: "Discrete Mathematics",
    instructor: "Dr. Elena Rossi",
    progress: 88,
    nextSession: { time: "Friday, 09:00", room: "LT-101" },
    status: "On Track",
    credits: 3,
  },
  {
    code: "HU101",
    name: "Technical Communication",
    instructor: "Prof. Liam O'Neil",
    progress: 30,
    nextSession: { time: "Monday, 11:00", room: "Room 402" },
    status: "On Track",
    credits: 2,
  },
];

export const ACADEMIC_STATS = {
  gpa: "8.42",
  creditsEarned: "64 / 120",
  semesterRank: "14 / 180",
} as const;
