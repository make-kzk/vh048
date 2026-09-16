# VibeHunt character art

Illustrations for VHUI vibes, ABCD drivers, and Belbin roles — **bean-doodle** style on dark hero surfaces.

| Folder | Purpose |
|---|---|
| `references/` | Canonical style JPGs (always pass to image generation) |
| `examples/` | Approved sample outputs |
| `prompt-templates/` | Copy-paste prompts for `GenerateImage` |
| `generated/` | Agent/human outputs (gitignore large batches if needed) |

**Skill:** [`.cursor/skills/vibe-character-art/SKILL.md`](../../../.cursor/skills/vibe-character-art/SKILL.md) — invoke as **`/vibe-character-art`** in Cursor Agent chat.

**Product slot:** 180×180 hero on Career Code screen.

**Copy SSOT:** `vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json` (32 vibes).

**Global install (any project):**

```bash
.cursor/skills/vibe-character-art/install-global-skill.sh
# Reload Cursor → /vibe-character-art works everywhere on this machine
```
