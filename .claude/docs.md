# Documentation rules

Storybook is the product documentation. The published site is built with
`storybook build --docs`, so only docs pages ship: MDX files and auto-generated
(`autodocs`) pages. Stories never appear on their own.

## One home per fact

| Content | Lives in |
|---|---|
| How to do something | a guide: `src/stories/guides/*.mdx`, title `Guides/<Name>` |
| What a prop or export is | JSDoc on the exported type, shown on `Components & Utilities/CioPia`. Add `argTypes` there only when JSDoc can't express it |
| Exported functions | `src/stories/reference/Utilities.mdx` |
| Install, one snippet, contributing, publishing | `README.md` |

Never restate a fact in a second place: link to its home. The README never
documents props or features.

## Public API only

Customers can import only what `src/index.ts` exports. Docs, snippets and
"Show code" (`parameters.docs.source.code`) use `CioPia` and those exports,
never internal components or hooks.

## Writing

- Brief. Lead with the snippet; one sentence per idea; no "This page covers…".
- Name the prop path exactly (`componentOverrides.carousel.item.reactNode`).
- Every snippet must work if copied. Include anything the code depends on
  (e.g. `data-slot='carousel-item'` on a custom carousel card).
- A new translation key goes in the list in the Customization guide.

## Stories

- Feature demos go in `src/stories/examples/`; accessibility test cases for
  non-exported components go in `src/stories/internal/`.
- Both are tagged `tags: ['!dev']`: hidden from the sidebar, still embeddable
  with `<Canvas of={…} />`, still run by the axe test-runner. Never give them
  `autodocs`, which would publish them.
- Embed a story only when its effect is visible on screen. Callbacks, network
  requests and tracking get a code snippet instead.
- Example metas set `argTypes: functionArgTypes` from `src/stories/utils.ts`
  so function props don't show as `{}` in Controls.

## Adding a guide

1. `src/stories/guides/<Name>.mdx` with `<Meta title='Guides/<Name>' />`.
2. Add it to `storySort` in `.storybook/preview.ts`.
3. If it is part of a first integration, add a step to the Integration Guide
   that links to it.

## Links

Link with `?path=/docs/<id>`. The id is the title lowercased with
non-alphanumerics turned into `-` (`Guides/Callbacks & Tracking` →
`guides-callbacks-tracking--docs`). Renaming a title breaks every link to it.

## Before merging

- `npm run lint`
- `storybook build --docs`, then check the sidebar shows only Introduction,
  Guides and Components & Utilities, and that every `?path=` link in
  `src/stories` exists in the build's `index.json`
- `npm run test-storybook:ci`
