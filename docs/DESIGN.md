\# RBU CampusOS — Design Direction



\## Objective



CampusOS should feel like a premium, highly interactive, spatial digital operating system for university life.



The quality bar is high-end creative-development work rather than ordinary SaaS or dashboard design.



The experience should feel:



\- authored

\- immersive

\- spatial

\- responsive

\- alive

\- technically sophisticated

\- visually memorable

\- functional

\- coherent



References such as Basement-style creative development and NexDash / NexOS may inform the quality bar.



Do not clone those products.



Extract principles from them rather than copying layouts or visuals.



\## Spatial / 3D philosophy



"3D" does NOT mean placing a random Three.js object into the interface.



Do not treat the following as sufficient 3D design:



\- random blobs

\- glowing spheres

\- floating toruses

\- generic metallic objects

\- decorative WebGL sculptures

\- isolated immersive-mode scenes

\- arbitrary 3D assets unrelated to CampusOS



The interface itself should feel dimensional.



Spatial techniques may include:



\- layered interface planes

\- perspective

\- depth

\- controlled parallax

\- foreground/background relationships

\- dimensional typography

\- pointer-responsive surfaces

\- physical-feeling interactions

\- spatial masks

\- depth-sensitive blur

\- lighting

\- shadows

\- material changes

\- shared-element transitions

\- camera-like movement

\- scroll choreography

\- contextual overlays

\- expanding objects

\- selective WebGL

\- shaders where appropriate



If CSS, SVG, Canvas, or conventional DOM rendering creates a better experience than WebGL, use the simpler solution.



Three.js should only be used where genuine spatial rendering improves the product.



\## Conceptual visual direction



CampusOS should visually communicate the idea of:



\*\*the campus as a living digital system.\*\*



Potential visual inspiration can come from:



\- campus topology

\- architectural geometry

\- abstracted maps

\- route systems

\- student activity

\- information networks

\- people and communities

\- events

\- academic systems

\- locations

\- connected nodes

\- dynamic interfaces



Visual elements should have some relationship to CampusOS rather than being arbitrary decoration.



\## Landing page



The landing page should immediately communicate:



1\. what CampusOS is

2\. why it exists

3\. what students can do with it

4\. how to enter the product



Avoid multiple redundant calls to action.



Do not simultaneously use several buttons such as:



\- Explore

\- Login

\- Open CampusOS

\- Enter CampusOS



unless they genuinely perform different actions and the hierarchy is clear.



The primary action should be obvious.



Avoid meaningless AI-generated hero imagery.



If imagery is used, it should reinforce the CampusOS concept.



Prefer authored or code-driven visual systems where suitable.



\## Authenticated application



The design quality must continue after the landing page.



Do not create a premium landing page followed by a generic dashboard.



All major product areas should belong to the same visual universe.



\## Layout



Avoid repeatedly using:



sidebar  

\+ page heading  

\+ three statistics  

\+ grid of rounded cards



Different types of information should use layouts appropriate to their purpose.



Possible interface structures include:



\- feeds

\- timelines

\- boards

\- spatial maps

\- tables

\- compact lists

\- contextual panels

\- inspectors

\- canvases

\- trays

\- overlays

\- split layouts

\- edge-to-edge sections

\- expanding objects

\- command interfaces

\- dashboards where dashboards genuinely make sense



\## Surface language



Do not make every container:



\- rounded

\- transparent

\- glassy

\- bordered

\- glowing

\- shadowed



Glassmorphism should be selective.



Border radius should be deliberate rather than universal.



Create clear visual hierarchy between different surface levels.



\## Cards



Cards should not look like generic AI-generated dashboard components.



Different content types can have different card structures.



Possible treatments include:



\- flush modules

\- editorial surfaces

\- dimensional cards

\- stacked surfaces

\- image-led cards

\- borderless objects

\- expandable cards

\- compact rows

\- data strips

\- panels

\- canvas-like areas



Do not force every piece of content into the same component.



\## Typography



Typography is part of the art direction.



Maintain clear hierarchy between:



\- display text

\- page titles

\- section headings

\- navigation

\- UI headings

\- card titles

\- body text

\- metadata

\- numerical information

\- system labels



Avoid generic AI-dashboard typography.



Avoid excessive tiny grey metadata.



Avoid fake futuristic fonts.



Large typography may be used where compositionally appropriate.



\## Color



Avoid excessive green tint.



Use a sophisticated neutral foundation with deliberate accent colors.



Color should communicate hierarchy and state rather than coating every surface.



\### Light mode



Light mode should feel:



\- architectural

\- bright

\- editorial

\- premium

\- spatial



Do not simply invert dark mode.



Avoid washed-out generic SaaS grey.



\### Dark mode



Dark mode should feel:



\- deep

\- cinematic

\- dimensional

\- calm

\- premium



Avoid generic black-and-neon cyberpunk styling.



\## Motion



Motion should communicate:



\- hierarchy

\- causality

\- feedback

\- navigation

\- state

\- spatial continuity

\- discovery



Do not animate something merely because a library supports it.



\### Suggested responsibility boundaries



Motion / Framer Motion:

\- normal UI transitions

\- layout transitions

\- gestures

\- component animation



GSAP:

\- complex timelines

\- selected cinematic sequences

\- advanced scroll-linked experiences



React Spring:

\- physics-based interactions where genuine spring behavior adds value



Three.js / React Three Fiber / Drei:

\- genuine spatial or WebGL experiences



React Bits / Aceternity / Motion Primitives / similar sources:

\- interaction ideas and implementation primitives

\- not visual templates



CSS:

\- preferred for simple performant transitions



Native View Transitions:

\- shared-element and route continuity where suitable



Do not use several animation libraries to solve the same interaction.



\## Buttons and interactions



Buttons should have a coherent system, including where needed:



\- primary

\- secondary

\- quiet

\- icon

\- destructive

\- contextual

\- segmented



Interactions should feel tactile and deliberate.



Possible effects include:



\- subtle magnetic response

\- controlled spring response

\- icon displacement

\- directional fill

\- depth shift

\- tactile press states

\- border movement



Do not apply extreme animation to every control.



\## Navigation



Navigation must remain completely usable.



Requirements include:



\- all routes reachable

\- navigation works on smaller laptop heights

\- scrolling works where needed

\- keyboard accessibility

\- clear active states

\- intentional mobile behavior

\- no accidental page-level horizontal scrolling



CampusOS may use:



\- sidebar

\- compact rail

\- dock

\- command launcher

\- contextual secondary navigation

\- hybrid navigation



Choose according to usability.



\## Mobile



Mobile is a first-class design target.



Do not simply stack desktop components vertically.



Use touch-native patterns where appropriate.



Potential mobile patterns include:



\- bottom navigation

\- adaptive dock

\- sheets

\- gestures

\- contextual headers

\- compact command interfaces



Heavy visual effects should degrade gracefully on lower-powered devices.



\## Campus AI



Campus AI should feel integrated into the operating system rather than appearing as another chatbot card.



Possible UI states include:



\- dormant

\- invoked

\- input

\- processing

\- response

\- contextual action

\- focused workspace



Do not imply AI functionality or reasoning behavior that does not actually exist.



\## Omnisearch / Command Center



Search should be a core CampusOS capability.



It should eventually make it fast to access:



\- pages

\- events

\- clubs

\- people

\- places

\- academics

\- actions

\- Campus AI



\## Anti-AI-slop rules



Avoid:



\- endless rounded cards

\- excessive pills

\- giant gradient blobs

\- meaningless glowing orbs

\- identical three-card layouts

\- fake statistics

\- fake functionality

\- arbitrary 3D

\- excessive gradient text

\- random sparkles

\- unnecessary glassmorphism

\- meaningless charts

\- component-library-demo aesthetics

\- excessive glows

\- random animations

\- huge empty hero sections

\- repeated icon + heading + description patterns

\- generic SaaS layouts

\- excessive green tint

\- decorative complexity without product purpose



Every major visual decision should feel intentional.



\## Accessibility and performance



Creative design must not compromise:



\- keyboard navigation

\- focus visibility

\- semantic markup

\- readable contrast

\- reduced-motion support

\- responsive behavior

\- loading performance

\- GPU performance

\- touch accessibility



Expensive effects should be lazy-loaded or simplified where appropriate.



The product must remain usable even if advanced effects are unavailable.









