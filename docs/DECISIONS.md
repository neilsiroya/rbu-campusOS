\# RBU CampusOS — Durable Decisions



This file records decisions that future development agents should not repeatedly reopen unless new evidence or requirements justify changing them.



Keep this file concise.



\## Product identity



CampusOS is a digital campus operating system and social/information layer.



It is not primarily an academic ERP.



Academic tools support the product but do not define its identity.



\## Demo data



Demo data may remain while real production data is unavailable.



Do not remove useful demo data merely because real data has not yet been connected.



Do not present demo data as verified official information.



\## Design direction



CampusOS should feel premium, spatial, highly interactive, and intentionally art-directed.



"3D" means spatial interface design.



Random blobs, spheres, toruses, isolated WebGL scenes, and decorative 3D objects do not satisfy the design objective.



The interface itself should communicate depth.



\## Design references



Basement-style creative development and NexDash / NexOS may inform the quality bar.



They are references, not templates.



Do not clone them.



\## Application quality



The authenticated CampusOS application must maintain the visual quality of the public landing experience.



Do not create a beautiful landing page followed by a generic dashboard.



\## Usability



Experimental presentation must not compromise usability.



Navigation, readability, accessibility, mobile behavior, and performance remain mandatory.



\## Light mode



Light mode is a first-class design target.



It must not be treated as an inverted version of dark mode.



\## Mobile



Mobile is a first-class design target.



Do not merely stack desktop layouts vertically.



\## Existing functionality



During visual redesigns, preserve working:



\- authentication

\- Supabase integrations

\- application routes

\- existing data models

\- working application logic



unless the active task explicitly changes them.



\## Animation tooling



Different animation technologies should have defined responsibilities.



Do not use multiple animation libraries unnecessarily for the same interaction.



Existing installed tooling should be preferred over installing redundant dependencies.



\## Architecture



Supabase/Postgres remains the primary data layer unless a future requirement provides a strong reason to change it.



Production infrastructure should be added according to actual requirements rather than architectural fashion.



\## Development workflow



The repository is the durable source of project context.



Conversation history is not.



Large changes must be decomposed into focused tasks with explicit acceptance criteria.



Current development state belongs in `docs/STATE.md`.



Long-term decisions belong in this file.



Task-specific implementation details belong in `docs/tasks/`.





