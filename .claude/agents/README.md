# Artisan's Eye — Claude Code agents

Ten project-specific subagents, written from scratch to match this codebase (Norkam marketplace + 3D/R3F + planned Web3). Not a clone of `contains-studio/agents` — most of that collection (TikTok strategist, app-store optimizer, mobile-app-builder) isn't useful here.

Each agent is a markdown file with YAML frontmatter. Claude Code auto-loads them; you can invoke one directly with `@agent-name` or let Claude Code route based on the `description` field.

## The set

### engineering/

| Agent | Use for |
|---|---|
| `r3f-3d-auditor` | Anything under `components/3d/`, any import from `three` / `@react-three/fiber` / `@react-three/drei` / `maath`. Catches material-clone bugs, disposal leaks, event-listener cleanup, phase coupling. |
| `nextjs-api-guard` | Any `app/api/**/route.ts`. Enforces Zod validation, auth, rate limiting, structured error responses. Proposes a shared `lib/api` layer on first use. |
| `zustand-auditor` | `components/state/useSceneStore.ts` and any consumer. Catches multi-slice reads without `useShallow`, state-machine violations, subscription leaks, dead `mintPhase` references. |
| `hydration-sleuth` | `app/layout.tsx`, providers, localStorage readers, dynamic imports. Catches SSR/CSR mismatches before they ship. |

### design/

| Agent | Use for |
|---|---|
| `thangka-brand-guardian` | Visual and copy review against `THEME.md` and the Norkam voice. Rejects orientalist shorthand, enforces palette and typography. |
| `a11y-reviewer` | Interactive UI, forms, 3D canvases. WCAG 2.2 AA target on a dark palette with cinematic motion. Enforces `prefers-reduced-motion`, keyboard fallbacks, canvas semantics. |
| `artisan-ux-researcher` | Flow reviews. Holds both sides of the marketplace (Pema the artisan / Maya the collector) in view and surfaces low-connectivity, language, and trust-cue gaps. |

### product/

| Agent | Use for |
|---|---|
| `listing-copywriter` | Artifact titles, descriptions, maker blurbs. Specialized for thangka, pottery, jewelry, textiles, singing bowls. Specificity over mystique. |
| `commission-brief-synthesizer` | Analyzing the `/api/brief/submit` Excel sheet. Clusters demand, scores brief quality, suggests matches. Pairs with the `xlsx` skill. |
| `marketplace-trend-researcher` | Pricing comparables, competitor mapping, export/customs reality, NFT-provenance precedent. Uses WebSearch/WebFetch, cites everything. |

## What's not here (and why)

- **No marketing agents** (TikTok, Instagram, Reddit, growth-hacker). Norkam's growth motion isn't defined yet; installing these would bias early decisions toward channels that may not fit a high-AOV craft marketplace.
- **No mobile/app-store agents.** This is a web app. Add when/if a native app ships.
- **No Web3/wallet agent yet.** Per `CLAUDE.md`, Web3 is aspirational. Add `web3-mint-scaffolder` when you're ready to wire `wagmi`/`viem` — don't pre-commit to an architecture.
- **No finance/legal agent.** Those require real humans. Research agents surface questions; humans answer them.

## How to extend

When you add an agent:

1. Put it in the right category folder (create a new one if none fits).
2. Frontmatter must include `name`, `description` (with concrete triggers — vague descriptions hurt routing), and optionally `tools` and `model`.
3. The description should name files/paths the agent owns. That's how Claude Code decides to invoke it.
4. The body should be terse and operational — not a manifesto. "What you look for," "output format," "when to escalate."
5. Update this README.

## Known gaps to address next

- A `web3-mint-scaffolder` when Web3 work starts — scaffolds `wagmi` + `viem` integration, drafts mint UI on `/artifact/[id]`, keeps components wallet-agnostic until the last moment.
- A `test-architect` when you pick a test runner (Vitest is the likely fit for this stack). Currently there are zero tests — bringing agents in before infrastructure would be premature.
- A `seller-onboarding-designer` once onboarding moves beyond the mock. The UX researcher covers this for now.
