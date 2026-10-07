\# RBU CampusOS — Current Project State



Last updated: 2026-10-07



\## Current phase



Frontend experience redesign and design-system stabilization.



\## Current objective



Establish a coherent CampusOS design foundation and then systematically redesign the product without relying on giant one-shot implementation prompts.



The current frontend works functionally in many areas but does not yet meet the intended visual and spatial quality level.



\## Current design problems observed



The latest large redesign pass did not fully achieve the intended direction.



Observed issues include:



\- landing page still lacks sufficient immersion

\- previous interpretation of "3D" relied too heavily on isolated graphical/3D elements

\- landing-page visual imagery did not feel sufficiently connected to CampusOS

\- redundant calls to action appeared in the landing experience

\- visual hierarchy requires improvement

\- typography requires stronger art direction

\- authenticated UI still contains generic/AI-generated-looking patterns

\- cards and surfaces require a more intentional visual language

\- sidebar/navigation requires usability review

\- sidebar scrolling has previously been problematic at smaller viewport heights

\- excessive green tint has appeared in parts of the design

\- spatial interaction is not consistently expressed throughout the application

\- horizontal scrolling has appeared where it was not necessarily intentional

\- mobile requires dedicated design and QA

\- all routes require systematic visual and functional review



\## Product functionality to protect



Do not intentionally break existing working:



\- authentication

\- Supabase integrations

\- application routes

\- demo data

\- existing product logic

\- search functionality

\- theme support

\- profile/settings behavior

\- any other already-functioning feature



Inspect the repository before assuming a feature is working or broken.



\## Current workflow change



The project is moving away from:



large master prompt

→ extremely long Codex run

→ usage exhaustion

→ repeated "resume" messages

→ context drift



The new workflow is:



durable repository context

→ small scoped task

→ implementation

→ verification

→ STATE update

→ checkpoint/commit

→ next task



\## Active task


`docs/tasks/00-frontend-audit.md`

Current objective: establish a verified baseline of the existing frontend before defining the Design Foundation implementation task.



The next planned task is:


## Next step

Complete Task 00.

After the audit, use the verified findings to define:

`docs/tasks/01-design-foundation.md`


This task should be written only after inspecting the current implementation so that already-completed work is not unnecessarily rebuilt.



\## Completed repository-context work



\- project documentation structure created

\- PRODUCT.md created

\- DESIGN.md created

\- ARCHITECTURE.md created

\- DECISIONS.md created

\- STATE.md created

\- CampusOS-specific instructions added to the existing root AGENTS.md



Mark an item complete only if it actually exists in the repository.



\## Known bugs / regressions



To be populated from actual browser and repository inspection.



Do not infer bugs solely from old conversation history.



\## Important changed files



Current documentation setup:



\- `AGENTS.md`

\- `docs/PRODUCT.md`

\- `docs/DESIGN.md`

\- `docs/ARCHITECTURE.md`

\- `docs/DECISIONS.md`

\- `docs/STATE.md`



Future tasks should update this list only when useful for handoff.



\## Next step



Audit the current frontend implementation and create:



`docs/tasks/01-design-foundation.md`



The first task should focus on establishing the reusable visual/design foundation before redesigning individual pages.



\## Resume / handoff procedure



Whenever work is resumed after a usage limit, context reset, new Codex conversation, or model switch:



1\. Read root `AGENTS.md`.

2\. Read `docs/STATE.md`.

3\. Read the active task file.

4\. Inspect `git status`.

5\. Inspect `git diff`.

6\. Inspect the relevant implementation.

7\. Run the application when visual or behavioral verification is required.

8\. Continue from the first incomplete acceptance criterion.



Do not restart completed work merely because previous conversation context is unavailable.



\## State-file rule



Keep this file concise and factual.



It is NOT:



\- a development diary

\- a reasoning transcript

\- a dump of every changed line

\- a replacement for Git history



It should answer:



\- Where are we?

\- What are we doing?

\- What is complete?

\- What is broken?

\- What happens next?



