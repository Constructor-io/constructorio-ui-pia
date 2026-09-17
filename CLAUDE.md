# constructorio-ui-pia

Embeddable React widget: an AI question-and-answer experience for a product page.
It is published to npm and runs inside a customer's site, so it is a guest on a
page it does not own.

## Accessibility

**Read `.claude/a11y.md` before reviewing or writing any JSX/TSX or CSS**, whether
the request says "accessibility" or not. Most regressions here arrive inside
changes made for some other reason.

Two automated layers are the merge gate, and both already run in CI:

- `npm run lint` — `eslint-plugin-jsx-a11y`, static issues in the source
- `npm run test-storybook:ci` — `axe-core` in real Chromium against every story

Colour is out of scope: `color-contrast` is disabled in the axe run because the
palette is the consumer's to restyle. State conveyed *only* by colour still needs
a non-visual equivalent.

They cover accessible names, ARIA validity and target size. They cannot
check whether an announcement actually happens, where focus goes, or whether a
name is any good. That judgement is what `.claude/a11y.md` describes.

Verifying a live region by hand: paste a `MutationObserver` over
`[aria-live], [role=status], [role=alert], [role=log]` in the browser console and
confirm the region was in the DOM *before* its content changed - a region created
together with its text is announced inconsistently.

## Constraints that shape the code

- **The DOM structure is public API.** Class names are what customers style
  against. Adding, removing or reordering elements can break their CSS even when
  our own rendering looks unchanged.
- **The stylesheet is optional.** Some customers ship their own styling through
  `componentOverrides`. Anything that must never be visible needs an inline
  style, not only a class.
- **`translate()` returns an explicitly empty string as-is.** Blanking a string is
  how consumers hide it; do not "fix" that. Add every user-facing string,
  including accessible names, to `defaultTranslations` and the `Translations`
  type.
- **Only `src/index.ts` is public.** Components and hooks outside it can change
  shape freely.

## Commands

- `npm run dev` — Storybook on 6006
- `npm test` — Jest
- `npm run lint`, `npm run check-types`
- `npm run test-storybook:ci` — axe against stories (starts its own server; no
  separate build step needed)
