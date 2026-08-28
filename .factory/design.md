# Visual thesis: the upgrade herbarium

## Direction

Self-Host Upgrade Rehearsal looks like a botanical field guide used at a workbench. Each upgrade path is treated as a specimen: labelled, compared, tested, and pressed into a receipt that can be handed to a customer. The visual language borrows the precision of herbarium sheets—not nostalgia or garden decoration. Fine rules, specimen labels, accession numbers, margin notes, and an asymmetric illustrated plant make the product feel methodical and calm.

The analogy fits the job. A vendor cannot know every customer environment, just as a field guide cannot contain every plant. It can record exactly what was observed, name the conditions, and mark what remains unsupported.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F3EEDC` | Warm herbarium-sheet background |
| `--paper-raised` | `#FFFCED` | Forms and receipt panels |
| `--ink` | `#18332D` | Primary text and rules |
| `--ink-muted` | `#53655E` | Supporting copy; 5.1:1 on paper |
| `--fern` | `#315E49` | Primary actions and positive state |
| `--moss` | `#76956C` | Secondary marks and illustration |
| `--orange` | `#A63A24` | Inspection stamps, focus, warnings; 5.5:1 on paper |
| `--yellow` | `#E9C95F` | Caution wash only, never sole status cue |
| `--danger` | `#9D2E2E` | Failure text and borders |
| `--night` | `#12231F` | Terminal and dark treatment |
| `--night-paper` | `#1A302A` | Dark raised surface |

The default is intentionally single-mode: the paper ground is part of the herbarium thesis. The embedded terminal provides the dark treatment where it has semantic purpose.

## Type

- Display and editorial labels: `Georgia`, `Times New Roman`, serif. It evokes field-reference publishing without a font download.
- Interface, code, and data: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, monospace. It makes versions, commands, and checks align.
- Body text starts at 17px with 1.6 line height. Receipt numbers use tabular figures.

System fonts avoid third-party requests and keep the initial transfer small.

## Spacing and shape

- Base unit: 8px. Section gaps: 64–112px. Text measure: 66 characters.
- Panels resemble specimen labels: square or 2px corners, one strong ink rule, and small clipped-corner details.
- Buttons resemble archive tabs. Primary buttons are solid fern with paper text. Secondary actions are underlined or outlined.
- Layout is editorial and asymmetric: copy occupies five columns while the plant and receipt occupy seven. On 390px screens the specimen follows the action and facts.

## Motion

The signature motion is a single inspection stamp settling onto the generated receipt after a rehearsal. It uses a 220ms scale and opacity transition. Section rules reveal once with a 240ms horizontal transform. Nothing loops.

With `prefers-reduced-motion: reduce`, both appear instantly. Route changes move focus without smooth scrolling. Terminal playback is controlled by the user and has a pause button.

## Asset plan and provenance

- `site/public/specimen-upgrade.webp`: original generated botanical hero. Prompt: “A scientific botanical field-guide plate on warm cream herbarium paper: one imaginary branching plant whose lower roots are drawn as Docker container layers and whose upper leaves carry tiny unlabeled version tags; beside it, a precise specimen envelope and red inspection stamp, hand-painted gouache and graphite with subtle paper grain, forest green, moss, rust orange and muted yellow, asymmetric vertical composition with clear negative space on the left, no words, no logos, no gradients, no photorealism, no watermark.” Generated on 2026-08-28 with `/opt/fleet/lib/gen-image.sh`, deployment `factory-image`, then converted to WebP. Factory-owned generated asset; MIT-distributed with this repository.
- `site/public/og-card.webp`: original 1200×630 crop composed from the same generated plate with product typography added in the build workspace. No third-party assets.
- Favicon and small leaf/receipt marks are hand-made SVG using only project palette colors.

The illustration explains the core model: known roots, an observed path, and explicitly labelled limits. It never contains essential text.
