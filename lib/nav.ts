import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Newspaper,
  Ghost,
  Calendar,
  Users,
  UserRound,
  Search,
  ShoppingBag,
  Map,
  Building2,
  LifeBuoy,
  BookOpen,
  Clock3,
  ClipboardList,
  FileText,
  GraduationCap,
  Gamepad2,
  Trophy,
  Briefcase,
  Zap,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Community",
    items: [
      { name: "Campus Feed", href: "/feed", icon: Newspaper },
      { name: "Confessions", href: "/confessions", icon: Ghost },
      { name: "Events", href: "/events", icon: Calendar },
      { name: "Clubs", href: "/clubs", icon: Users },
      { name: "People", href: "/people", icon: UserRound },
      { name: "Lost & Found", href: "/lost-found", icon: Search },
    ],
  },
  {
    group: "Campus & Exchange",
    items: [
      { name: "Campus Map", href: "/map", icon: Map },
      { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
      { name: "Facilities", href: "/facilities", icon: Building2 },
      { name: "Services", href: "/services", icon: LifeBuoy },
      { name: "Hostels", href: "/hostels", icon: Building2 },
    ],
  },
  {
    group: "Knowledge & Academics",
    items: [
      { name: "Study Hub", href: "/notes", icon: BookOpen },
      { name: "Academics", href: "/academics", icon: GraduationCap },
      { name: "Timetable", href: "/timetable", icon: Clock3 },
      { name: "Attendance", href: "/attendance", icon: ClipboardList },
      { name: "Assignments", href: "/assignments", icon: FileText },
      { name: "Exams", href: "/exams", icon: GraduationCap },
    ],
  },
  {
    group: "Student Life",
    items: [
      { name: "Sports", href: "/sports", icon: Trophy },
      { name: "Gaming", href: "/gaming", icon: Gamepad2 },
    ],
  },
  {
    group: "Opportunities",
    items: [
      { name: "Internships", href: "/internships", icon: Briefcase },
      { name: "Hackathons", href: "/hackathons", icon: Zap },
      { name: "Placements", href: "/placements", icon: GraduationCap },
    ],
  },
  {
    group: "System & AI",
    items: [
      { name: "Campus AI", href: "/campus-ai", icon: Sparkles },
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/feed": "Campus Feed",
  "/confessions": "Confessions",
  "/events": "Events",
  "/clubs": "Clubs",
  "/people": "People",
  "/lost-found": "Lost & Found",
  "/marketplace": "Marketplace",
  "/map": "Campus Map",
  "/facilities": "Facilities",
  "/hostels": "Hostels",
  "/services": "Services",
  "/notes": "Study Hub",
  "/academics": "Academics",
  "/timetable": "Timetable",
  "/attendance": "Attendance",
  "/assignments": "Assignments",
  "/exams": "Exams",
  "/internships": "Internships",
  "/hackathons": "Hackathons",
  "/placements": "Placements",
  "/sports": "Sports",
  "/gaming": "Gaming",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/campus-ai": "Campus AI",
  "/profile": "Profile",
};

export function titleForPath(pathname: string) {
  return PAGE_TITLES[pathname] ?? "CampusOS";
}

export const SEARCHABLE_ROUTES = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    group: group.group,
  }))
);
