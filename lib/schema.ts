/**
 * Intended CampusOS persistence (not implemented).
 *
 * Auth today uses Supabase Auth only (`lib/supabase.ts`).
 * Community features currently use demo seed data + sessionStorage.
 *
 * Tables to add when a database is available:
 *
 * profiles (id uuid pk -> auth.users, full_name, branch, year, avatar_url, bio)
 * posts (id, author_id, body, category, anonymous, created_at)
 * post_reactions (post_id, user_id, kind)
 * comments (id, post_id, author_id, body, anonymous, created_at)
 * confessions (id, alias, body, category, created_at)
 * events (id, title, starts_at, location, category, club_id)
 * event_rsvps (event_id, user_id, status)
 * clubs (id, name, category, description)
 * club_memberships (club_id, user_id, role)
 * lost_found_listings (id, kind, title, location, category, status, author_id)
 * notifications (id, user_id, title, body, href, read_at)
 */
export const CAMPUSOS_SCHEMA_VERSION = 1;
