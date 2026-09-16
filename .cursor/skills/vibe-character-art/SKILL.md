---
name: vibe-character-art
description: "/vibe-character-art — generate VibeHunt bean-doodle archetype illustrations (32 VHUI vibes, ABCD drivers, Belbin roles). Hero 180×180 or full card."
disable-model-invocation: true
---

# /vibe-character-art

Generate VibeHunt personality-archetype illustrations: minimalist **bean-shaped** characters on a **dark hero surface**, white **hand-drawn doodle** line-art, Russian handwritten typography.

Output directory: **`{GENERATED_ROOT}/`** — see §Path resolution below.

**Use in any Cursor project (no GitHub):** run `./install-global-skill.sh` from this folder. It copies the skill, reference JPGs, example, and VHUI table into `~/.cursor/skills/vibe-character-art/`.

---

## Slash command entrypoint

When the user invokes **`/vibe-character-art`** (with optional arguments), follow this flow **immediately** — do not ask which skill to use.

### 1. Parse arguments

Text after the command (space-separated, case-insensitive):

| Pattern | Action |
|---|---|
| *(empty)* | Show quick menu (below), then proceed once user picks or adds args |
| `A3W` / `a3w` | VHUI vibe by id |
| `A3W hero` | VHUI hero crop 180×180 |
| `A3W card` | VHUI full card 1:1 |
| `driver kapitan` / `driver мавerik` | ABCD driver card (see §4) |
| `belbin хранитель` | Belbin role card (see §4) |
| `batch abcd` | All 5 ABCD driver cards |
| `batch belbin` | All 7 Belbin role cards |
| `batch vibes A3*` | VHUI pole group (e.g. all `A3Q`, `A3W`, `A3E`, `A3R`) |

Default layout if omitted: **`hero`** for VHUI ids, **`card`** for driver/belbin names.

### 2. Empty invoke — show menu

Reply briefly, then wait for user choice or generate if they already typed args on the next line:

```
/vibe-character-art — что генерируем?

1. VHUI hero — например: /vibe-character-art A3W hero
2. VHUI card  — /vibe-character-art A3W card
3. ABCD driver — /vibe-character-art driver kapitan
4. Belbin role — /vibe-character-art belbin хранитель
5. Batch — /vibe-character-art batch abcd | batch belbin | batch vibes A3*
```

### 3. Execute generation

1. **Resolve paths** (see §Path resolution below).
2. Load VHUI copy from `{SKILL_ROOT}/data/vhui_tabl.json` (global) or `vibehunt-backend/.../vhui_tabl.json` (in-repo) for VHUI ids.
3. Open all three reference JPGs.
4. Build prompt from §5, call `GenerateImage` with three references.
5. Review §7 checklist; regenerate once if style drifts.
6. Save to `{GENERATED_ROOT}/{filename}`.
7. Update `{GENERATED_ROOT}/manifest.md`.
8. Show result image to user.

### Path resolution

Use the first match:

| Asset | Global install | In-repo (vh48 workspace) |
|---|---|---|
| Skill + refs | `~/.cursor/skills/vibe-character-art/` | `.cursor/skills/vibe-character-art/` + `mockups/vibe-hunt/art/` |
| References | `{SKILL_ROOT}/references/*.jpg` | `mockups/vibe-hunt/art/references/*.jpg` |
| Example | `{SKILL_ROOT}/examples/captain-archetype.png` | `mockups/vibe-hunt/art/examples/captain-archetype.png` |
| VHUI JSON | `{SKILL_ROOT}/data/vhui_tabl.json` | `vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json` |
| Output | `{SKILL_ROOT}/generated/` | `mockups/vibe-hunt/art/generated/` |

`SKILL_ROOT` = `$HOME/.cursor/skills/vibe-character-art` if `references/` exists there.  
`GENERATED_ROOT` = `{SKILL_ROOT}/generated` (global) or `mockups/vibe-hunt/art/generated` (in-repo).

---

## Tool: `cursor` → `GenerateImage`

```
GetDynamicTools { namespace: "cursor", toolName: "GenerateImage" }
CallDynamicTool {
  namespace: "cursor",
  toolName: "GenerateImage",
  arguments: {
    description: "<filled prompt from §5>",
    filename: "<see §7>",
    aspect_ratio: "1:1",
    reference_image_paths: [
      "{SKILL_ROOT}/references/6f144722-e0bc-429b-b58e-eab882d735cf.jpg",
      "{SKILL_ROOT}/references/f03e5cfe-462c-4a17-bbce-d15ddd5583bf.jpg",
      "{SKILL_ROOT}/references/a9fb5a64-ba60-4b27-8504-8c7b6ecd23af.jpg"
    ]
  }
}
```

Replace `{SKILL_ROOT}` with the resolved path from §Path resolution (absolute paths recommended). **Always** pass all three references.

Approved example: `{SKILL_ROOT}/examples/captain-archetype.png` (or in-repo `mockups/vibe-hunt/art/examples/…`).

---

## 1. Visual language (non‑negotiables)

### Body & face

| Element | Rule |
|---|---|
| Silhouette | Vertical **bean / capsule** — rounded ovoid, no neck, no realistic anatomy |
| Fill | One **saturated flat color** + subtle grain/stipple OK |
| Outline | Thin **white** stroke around the body |
| Eyes | Two **black dots**, or **closed arcs** for calm/empathic types |
| Mouth | Single thin **curved smile** line |
| Limbs | **White noodle lines** — hand-drawn; hands = simple loops |
| Legs | Optional; omit for hero crop (180×180) |

### Background & line-art

- Background: **solid dark charcoal** `#1A1A1A`.
- Icons, arrows, props, limbs: **white line-art only** — chalk/sketch feel.
- **No** gradients, 3D, photorealism, anime, emoji style.

### Layout variants

| Variant | Use | `aspect_ratio` |
|---|---|---|
| **Hero** | Career Code 180×180 | `1:1` — minimal text, crop-safe |
| **Card** | Reference / PDF | `1:1` — title, traits, doodles, motto |
| **Grid** | 5 drivers / 7 Belbin | `4:3` or `16:9` |

---

## 2. Color system

| Pole / role | Hex (guide) |
|---|---|
| Drive A — maverick | `#E53935` |
| Drive B — captain | `#FF8C00` |
| Drive C — analyst | `#66BB6A` |
| Drive D — specialist | `#26A69A` |
| Collaboration | `#9C27B0` |
| Persuasion | `#EC407A` |
| Individual | `#7E57C2` |
| Energy | `#FFCA28` |

VHUI: hue from `BADp` first letter; vary by `SUdr` within pole.

---

## 3. Props & doodles

| Signal | Accessory | Doodles |
|---|---|---|
| Leader | Captain hat | Mountain+flag, star |
| Maverick | Sunglasses | Rocket, lightning, crown |
| Analyst | Round glasses | Magnifying glass, charts |
| Specialist | Headphones | Books, mug |
| Collaborator | Heart at chest | Team silhouettes, hearts |
| Guardian | Glasses + shield | Padlock |
| Operator | Clipboard | Checklist, clock |
| Researcher | Glasses + book | Lightbulb |

Motto: 3 Russian nouns with dots + small icon.

---

## 4. Data sources

**VHUI (32):** `vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json`
- Title: `META_VH_name` (strip «Вайб » on cards if needed)
- Tagline: `META_VH_cenost`
- Motto seeds: `META_VH_vibrantforces[0..2]`

**ABCD drivers:** Маверик · Капитан · Аналитик · Специалист · Сотрудничающий

**Belbin (7):** Убеждающий · Индивидуалист · Предприниматель · Оператор · Хранитель · Исследователь · Альтруист

---

## 5. Prompt template

```
A VibeHunt archetype character illustration in minimalist hand-drawn doodle style on solid dark charcoal background (#1A1A1A).

Character: "{TITLE_RU}" — a {COLOR} ({HEX}) bean-shaped capsule body with thin white outline, simple dot eyes and curved smile. {ACCESSORY}. Thin white noodle-line arms: {POSE}.

Surrounding white chalk-like doodle icons: {DOODLES}.

Typography in Russian, handwritten casual Cyrillic:
- Top title "{TITLE_RU}" in large {COLOR}
- {TRAITS_OR_TAGLINE}
- Bottom motto "{MOTTO}" with small {ICON} icon

Style: flat doodle, NOT 3D/anime/photorealistic. White line-art only. Match VibeHunt Career Code references.
Layout: {hero|card|grid}. {NOTES}.
```

More examples: `mockups/vibe-hunt/art/prompt-templates/card.md`.

---

## 6. File naming

| Output | Pattern |
|---|---|
| VHUI hero | `vibe-{id}-hero.png` |
| VHUI card | `vibe-{id}-card.png` |
| ABCD driver | `driver-{slug}-card.png` |
| Belbin | `belbin-{slug}-card.png` |

---

## 7. Quality checklist

- [ ] Bean silhouette, dark `#1A1A1A` bg, white line-art only
- [ ] Title color = body color; readable Russian Cyrillic
- [ ] Hero survives center crop to 180×180
- [ ] VHUI copy verbatim from `vhui_tabl.json`
- [ ] Matches reference JPGs more than generic flat art

---

## 8. Related paths

| Path | Purpose |
|---|---|
| `~/.cursor/skills/vibe-character-art/` | **Global install** (see `install-global-skill.sh`) |
| `mockups/vibe-hunt/art/` | In-repo art bundle |
| `install-global-skill.sh` | Copy skill + assets to `~/.cursor/skills/` |
