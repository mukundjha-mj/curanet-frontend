# Naming Conventions

This project uses strict naming rules to keep files and symbols production-ready and predictable.

## Core Rules

- Use kebab-case for all file and folder names.
- Use PascalCase for all exported React components.
- Use camelCase for local variables, functions, and hooks internals.
- Keep names domain-specific; avoid generic names like demo, temp, test, sample, old, new, final.

## UI File Types

- Page files: `kebab-case-page.tsx`
  - Applies to: `src/components/ui` and `src/pages`
  - Examples: `home-page.tsx`, `features-page.tsx`, `security-page.tsx`, `dashboard-page.tsx`
- Section files: `kebab-case-section.tsx`
  - Examples: `feature-highlights-section.tsx`, `care-workflow-visual-section.tsx`
- General UI components: `kebab-case.tsx`
  - Examples: `button.tsx`, `dialog.tsx`, `footer-section.tsx`

## Component Naming

- Exported component names must be PascalCase and should match the file intent.
- Recommended pattern for page exports:
  - `home-page.tsx` -> `Home`
  - `blog-page.tsx` -> `BlogPage`
- Recommended pattern for section exports:
  - `feature-highlights-section.tsx` -> `FeatureHighlightsSection`
  - `care-workflow-visual-section.tsx` -> `CareWorkflowVisualSection`

## Hooks and Utilities

- Hooks must start with `use` and use kebab-case file names.
  - Examples: `use-page-seo.ts`, `use-route-history.ts`
- Utility and API modules should be concise and descriptive.
  - Examples: `utils.ts`, `client.ts`, `curanet.ts`, `types.ts`

## Routing and Consistency

- Route path names should align with page file intent.
- Keep imported symbol names consistent with exported names.
- After renaming files, update all imports and run:
  - `npm run typecheck`
  - `npm run build`

## Lint Enforcement

- ESLint enforces kebab-case filenames for `src/components/**/*.tsx`.
- ESLint enforces PascalCase for exported names in TSX component files.
- Run `npm run lint` locally before opening a PR.

## PR Checklist (Naming)

- No placeholder or temporary naming.
- File names follow kebab-case.
- Exported components are PascalCase.
- Page and section suffix rules are respected.
- No stale imports from old file names.
