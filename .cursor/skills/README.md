# Cursor skills (vh48)

Project skills appear as **slash commands** in Agent chat.

| Command | Skill |
|---|---|
| `/create-catalog-card` | Добавить карточку в каталог: мокап + запись в `catalog.json` (workflow из [Vaibee](https://github.com/make-kzk/Vaibee)) |
| `/vibe-character-art` | Generate VibeHunt bean-doodle archetype illustrations (VHUI, ABCD, Belbin) |

**Global install for `/vibe-character-art` (any project, no GitHub):**

```bash
.cursor/skills/vibe-character-art/install-global-skill.sh
# Reload Cursor → /vibe-character-art works everywhere on this machine
```

Skills live in `.cursor/skills/<name>/SKILL.md`. The folder name must match the `name` field in frontmatter.

After adding or editing a skill, reload the workspace (or restart Cursor) if `/command` does not appear in the picker.
