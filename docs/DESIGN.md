# Design system

> The tokens and components behind the explorer — one place to restyle and re-theme the whole site.

The explorer is a dependency-free static site. `site/style.css` is organised around design tokens; components consume tokens rather than literal values so the whole UI can be restyled and themed from one place.

## Tokens

Defined on `:root` in `site/style.css`.

| Group | Tokens |
|---|---|
| Colour | `--paper`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--on-accent`, `--danger`, `--backdrop`, `--row-hover` |
| Space (4px base) | `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 |
| Radius | `--radius` 3px · `--radius-lg` 6px |
| Type | `--fs-xs` 11 · `--fs-sm` 12 · `--fs-md` 13 · `--fs-base` 15 · `--fs-lg` 17 · `--fs-xl` 18 · `--fs-2xl` 24 · `--fs-3xl` 27 |
| Fonts | `--font` (system UI) · `--mono` |
| Layout | `--page-x` · `--content` 1150px · `--aside` 255px |
| Misc | `--border`, `--focus`, `--focus-offset` |

Themes override only colour tokens. A dark theme is applied automatically via `@media (prefers-color-scheme: dark)`.

## Components

- **Layout**: `.layout` is a two-column grid (`--aside` + fluid results); collapses to one column at `≤900px`. `aside` is sticky on desktop.
- **Buttons**: base `button` (solid), `.secondary` (outline), `.model-name` (link-like), `.sort` (table header control). All include icons via `<svg class="icon">`.
- **Forms**: `label`, `input/select/textarea`, `.check` (checkbox rows), `.pair` (two-up), `.advanced` (a `<details>` block).
- **Need matcher**: `.need`, `.need-actions`, `.need-constraints`, `.locale`.
- **Results**: `.result-head`, `.table-wrap`, `.legend`, `.fine`, `.small`, `.badge`, `.empty`, `.error`.
- **Dialog**: native `<dialog>` with `::backdrop`.
- **Skeleton**: `.sk`/`.sk-row` shimmer shown until `data/catalog.json` loads; respects `prefers-reduced-motion`.

## Conventions

- No third-party CSS, fonts or CDN. Icons are inlined Font Awesome-free SVG symbols in `index.html`.
- Spacing and type come from tokens; avoid new literals.
- Interactive text buttons set `font: inherit` and inherit `color`/`letter-spacing`.
- The strict Content-Security-Policy (`default-src 'self'`) must remain valid: no inline styles, no remote assets.
- Accessibility: visible `:focus-visible` outline, a skip link, `role="status"` on the result count, `aria-sort` on sortable headers, and `lang`/`dir` set per locale.
- Print styles strip chrome (`aside`, need matcher, controls) and render the catalogue table.
