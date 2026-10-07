# RBU CampusOS — Architecture Context



\## Current core stack



CampusOS currently uses a modern web stack centered around:



\- Next.js App Router

\- React

\- TypeScript

\- Tailwind CSS

\- Supabase

\- Vercel



The repository and `package.json` are authoritative for exact versions and installed dependencies.



Do not assume a package exists merely because it was previously discussed.



Inspect the repository first.



\## Architectural principle



Prefer the simplest architecture that satisfies the current product requirement.



Do not build unnecessary infrastructure merely to make the system appear sophisticated.



At the same time, avoid decisions that unnecessarily prevent CampusOS from becoming a real production product.



\## Major production areas



CampusOS eventually requires deliberate work across:



\### Frontend



\- UI architecture

\- responsive behavior

\- accessibility

\- state management

\- forms

\- loading states

\- empty states

\- error states

\- animation

\- spatial/3D experiences

\- frontend performance



\### APIs and backend logic



\- server-side business logic

\- API routes / server actions

\- validation

\- moderation logic

\- Campus AI integration

\- university information ingestion

\- notifications

\- search

\- marketplace logic

\- confession/community systems



\### Database and storage



\- Supabase/Postgres schema

\- relationships

\- migrations

\- indexes

\- foreign keys

\- media/file storage

\- retention

\- backups



\### Authentication and permissions



\- authentication

\- sessions

\- user profiles

\- student roles

\- moderator roles

\- administrative permissions

\- potential student/university verification



\### Security



\- Supabase Row Level Security

\- server-side authorization

\- secret management

\- validation

\- abuse prevention

\- upload security

\- dependency security

\- XSS/CSRF considerations where applicable



\### Rate limiting



Potentially required for:



\- authentication

\- Campus AI

\- anonymous confessions

\- posting

\- messaging if added

\- search

\- uploads

\- expensive API operations



\### Caching and CDN



Potential use areas include:



\- static assets

\- images

\- public campus information

\- API responses

\- university-source ingestion

\- frequently accessed read-heavy data



Caching must have deliberate invalidation behavior.



\### Background jobs



Potential background work includes:



\- university website ingestion

\- scheduled synchronization

\- notification generation

\- indexing

\- AI processing

\- cleanup jobs



Do not introduce queue systems until actual requirements justify them.



\### Search



Search may eventually include:



\- pages

\- people

\- events

\- clubs

\- opportunities

\- places

\- academics

\- official information



The architecture should be chosen according to actual search requirements.



\### Hosting and deployment



Current deployment target is Vercel unless deliberately changed.



Production concerns include:



\- environment separation

\- secrets

\- preview deployments

\- production deployment

\- domain configuration

\- build reliability



\### CI/CD and version control



The project should eventually include:



\- automated checks

\- linting

\- type checking

\- tests

\- deployment verification

\- safe database migration workflow

\- disciplined Git history



\### Observability



Production readiness should include:



\- error tracking

\- structured logs

\- frontend error monitoring

\- API failure monitoring

\- database error visibility

\- ingestion failure visibility

\- AI integration failure visibility



\### Analytics



Product analytics may eventually help measure:



\- feature adoption

\- search behavior

\- navigation

\- event discovery

\- retention

\- Campus AI usage



Privacy must be considered before collecting user data.



\## Supabase



Supabase/Postgres is the primary data layer unless a future requirement justifies another system.



Use where appropriate:



\- explicit schemas

\- typed interfaces

\- indexes

\- foreign keys

\- migrations

\- Row Level Security



Client-side UI restrictions are NOT sufficient authorization.



Sensitive operations must be enforced server-side and/or through database policies.



\## Official RBU information



Long-term target:



RBU Official Sources

→ ingestion process

→ normalization

→ Supabase

→ CampusOS Feed / Events / Search / Notifications / Campus AI



Prefer official machine-readable sources such as APIs or feeds when available.



Use scraping only where necessary and legally/technically appropriate.



Ingestion should eventually support:



\- deduplication

\- source references

\- timestamps

\- content type

\- title

\- body/excerpt

\- attachments

\- images

\- source URL

\- stable external identifiers or hashes



\## Campus AI



Campus AI architecture should eventually define:



\- what data AI may access

\- retrieval mechanism

\- permissions

\- source attribution

\- rate limits

\- cost control

\- privacy

\- fallback behavior

\- error behavior



Do not expose private student data to AI systems without deliberate authorization and privacy design.



\## Scalability philosophy



Do not prematurely engineer CampusOS for millions of users.



First build a reliable architecture suitable for realistic university usage.



Scale based on measured bottlenecks.



Avoid introducing:



\- unnecessary microservices

\- unnecessary message brokers

\- unnecessary distributed caches

\- unnecessary load-balancing complexity



until requirements justify them.



