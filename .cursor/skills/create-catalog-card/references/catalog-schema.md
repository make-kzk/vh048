# catalog.json — schema reference

## vh48 (this repo)

File: `catalog.json` at repository root.

```json
{
  "mockups": [
    {
      "slug": "vibe-hunt",
      "title": "VibeHunt (VibeHunt88)",
      "summary": "Оригинальный click-through из VibeHunt88/web: landing → register → cabinet → vibe → reports.",
      "path": "mockups/vibe-hunt/index.html",
      "tags": ["vibehunt", "vibehunt88", "production-design"]
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | Folder name under `mockups/`; unique |
| `title` | yes | Card heading on portal |
| `summary` | yes | Card subtitle; 1–2 sentences |
| `path` | yes | Relative href to `index.html` |
| `tags` | no | String array for filtering / future badges |

---

## Vaibee (source workflow)

File: `SYST/catalog.json`.

### concepts[]

```json
{
  "slug": "team-motivational-map",
  "title": "Team Motivational Map",
  "status": "draft",
  "date": "2026-09-05",
  "tags": ["mcode", "team", "motivation"],
  "summary": "Interactive example of a filled MCode Team Motivational Map template.",
  "research": ["mcode"]
}
```

Portal link: `PRDT/concepts/{slug}/prototype/index.html`

### research[]

```json
{
  "slug": "notion",
  "title": "Notion",
  "status": "complete",
  "date": "2026-09-05",
  "tags": ["knowledge-base", "collaboration"],
  "summary": "All-in-one workspace: notes, databases, wikis.",
  "path": "RSCH/RSCH-01-00-00/products/notion/README.md"
}
```

Portal link: `path` field, or fallback `RSCH/RSCH-01-00-00/products/{slug}/README.md`

### Extra Vaibee fields (optional in vh48)

| Field | Values | UI |
|---|---|---|
| `status` | `draft`, `complete`, `in-progress` | Badge color on portal |
| `date` | `YYYY-MM-DD` | Metadata |
| `research` | slug[] | Links concept → research sources |
