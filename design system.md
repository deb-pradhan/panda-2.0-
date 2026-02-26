Design System: "Technical Blueprint"

Version: 3.0 (Absolute Black & Electric Blue)

Status: Active

Aesthetic Classification: Digital Industrial / High-Fidelity Wireframe / Monolithic Dark

1. Core Philosophy

This system treats the User Interface as a technical schematic. It eschews modern "soft" UI trends (shadows, blurs, gradients) in favor of absolute clarity, rigid grids, and raw data presentation. 

The 3 Laws

The Metaphor: A pitch-black glass interface illuminated by precise, electric blue data lines.

The Rule of Ink: If it doesn't convey data or structure, remove it. Embellishments are strictly forbidden.

The Rule of Edge: Containers are sharp (0px radius); controls are organic (999px radius).

2. Color System & Harmony

The palette relies on "Absolute Black" and pure, neutral monochromatic greys. By stripping all color temperature from the background surfaces, the electric blue accent color achieves maximum visual impact and clarity.

2.1 Accent Token (The "Live Wire")

The accent color is treated as a high-intensity LED. It indicates active energy, critical data, or primary interactivity.

Token

Hex

Role

color-accent-main

#1464FF

Primary Actions, Active States, Data Highlights

color-accent-hover

#3B7DFF

Hover states for primary actions

color-accent-subtle

#001A4D

Faint accent wash for emphasis areas

2.2 Surface Tokens (Monolithic Greys)

Theory: We use pure black and neutral greys. No blue or brown undertones. This creates a stark, high-contrast canvas that maximizes readability.

Token

Hex

Role

surface-canvas

#000000

Global background (Absolute Black)

surface-card

#0A0A0A

Primary container background (Slightly Elevated)

surface-subtle

#141414

Internal segmentation (Subtle Lift)

2.3 Ink Tokens (Text & Icons)

Token

Hex

Role

ink-primary

#FFFFFF

Headlines (Pure white for maximum contrast)

ink-secondary

#A3A3A3

Labels, body text (Clear, readable mid-grey)

ink-tertiary

#525252

Placeholders, disabled states

ink-on-accent

#FFFFFF

Text inside primary buttons

2.4 Border Tokens

Token

Hex

Role

border-grid

#262626

Structural lines (Sharp, neutral edge)

border-element

#333333

Subtle borders within a card

2.5 Functional Signals (Semantic)

Theory: Signal colors must be vibrant enough to read clearly against pure black, while maintaining distinct hues to avoid confusion with the primary blue.

Token

Hex

Role

Relation to Accent

signal-error

#FF3333

Critical Failure

High Alert (Vibrant Red)

signal-warning

#FFB800

Attention Needed

Caution (Vibrant Amber)

signal-success

#00CC66

Operational

Safe (Vibrant Green)

3. Typography (Coherent & Accessible)

Typography drives the elegance and usability of the system. We have unified the font stack to a single, highly legible superfamily (Geist) to ensure absolute coherence. Base sizes have been increased across the board to guarantee readability and establish a commanding, clear hierarchy.

Primary Font: Geist Sans (Rational, clean, perfectly balanced).
Data Font: Geist Mono (Engineered for data density, perfectly pairs with Geist Sans).

3.1 Type Scale & Dynamics

Refinement Note: Hierarchy is achieved through a combination of stark size contrasts and deliberate weight shifts.

Role

Weight

Size

Line Height

Tracking

Case

Display XL

Medium (500)

64px

1.1

-2.0%

Sentence

H1 Title

Medium (500)

32px

1.2

-1.0%

Sentence

H2 Subhead

Medium (500)

20px

1.3

-0.5%

Sentence

Body Reading

Regular (400)

16px

1.5

0%

Sentence

Label/Micro

Medium (500)

13px

1.2

+4%

UPPERCASE

Data Numerical

Regular (400)

15px

1.4

0%

Tabular Nums

3.2 Typographic Rules

Tabular Figures: All numbers in data tables or dashboards must use font-variant-numeric: tabular-nums to ensure vertical alignment.

Optical Alignment: For Display XL, allow characters to hang slightly into the margin if possible for optical straightness.

No Italics: This system does not use italics. If emphasis is needed, use weight (Medium) or color (color-accent-main).

4. Grid Architecture (The "Bento" Logic)

The layout uses a visible modular grid to establish absolute order.

Gap: 0px. No transparency between cards.

Separation: Cards are separated by 1px solid lines (border-grid).

Intersections: Clean and sharp. No decorative artifacts or markers at grid intersections. The grid lines speak for themselves.

5. Component Library

5.1 Containers (Cards)

Shape: Strictly Rectangular.

Border Radius: 0px.

Shadows: None.

Stroke: 1px border-grid outline.

Header: Title (Top Left) + Directional Icon (Top Right, in Accent Color).

5.2 Buttons & Controls

Controls serve as the organic contrast to the rigid grid.

Shape: Full Pill (Capsule). border-radius: 999px.

Primary Action: Solid #1464FF background, White text.

Secondary Action: Transparent background, 1px #1464FF border, #1464FF text.

Toggles: High contrast. #1464FF circle thumb on a #262626 track.

5.3 Iconography

Style: Linear / Stroke-based.

Stroke Width: 1.5px (Uniform).

Active State: Rendered in Accent Color.

6. Data Visualization

Data should feel like it is drawn with a high-precision laser on black glass.

Charts: 2px stroke weight for primary data (increased for visibility).

Active Data Line: Rendered in Accent #1464FF.

Context Lines: Rendered in ink-secondary (#A3A3A3).

Fills: No solid fills. Use vertical hatching or dithering.

7. Imagery & Texture

The "Dither" Mandate: Photographic or 3D content must never be rendered in full gradients. It must be processed to look like 1-bit or grayscale print.

Standard: Grayscale Dither (White dots on Pure Black).

Featured/Active: Duotone Dithering (Electric Blue #1464FF dots on Pure Black).

Perspective: Isometric or Orthographic preferred.

8. Developer Handoff (CSS Variables)

:root {
  /* Surface (Absolute Black & Neutral Greys) */
  --surface-canvas: #000000;
  --surface-card:   #0A0A0A;
  --surface-subtle: #141414;

  /* Ink (High Contrast) */
  --ink-primary:   #FFFFFF;
  --ink-secondary: #A3A3A3;
  --ink-tertiary:  #525252;
  --ink-on-accent: #FFFFFF;

  /* Accent (Electric Blue) */
  --color-accent-main:   #1464FF;
  --color-accent-hover:  #3B7DFF;
  --color-accent-subtle: #001A4D;

  /* Functional Signals */
  --signal-error:   #FF3333;
  --signal-warning: #FFB800;
  --signal-success: #00CC66;

  /* Borders */
  --border-grid:    #262626;
  --border-element: #333333;
  --border-accent:  #1464FF;
  
  /* Typography Stack (Unified & Coherent) */
  --font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}

/* Utility Class: Grid Intersections */
.grid-cell {
  position: relative;
  background: var(--surface-card);
  border: 1px solid var(--border-grid);
}
