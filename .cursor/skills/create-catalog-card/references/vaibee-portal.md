# Vaibee portal cards — UI reference

Source: `make-kzk/Vaibee/index.html`

Vaibee renders two sections from `SYST/catalog.json`:

1. **Concepts** — links to `PRDT/concepts/{slug}/prototype/index.html`
2. **Research** — links to `path` or default README path

## Card HTML structure

```html
<a class="card" href="…">
  <div class="card-body">
    <div class="card-title">{title}</div>
    <div class="card-summary">{summary}</div>
    <div class="card-meta">
      <span class="badge status-{status}">{status}</span>
      <span class="badge">{tag}</span>
    </div>
  </div>
  <span class="card-arrow">→</span>
</a>
```

## Status badge colors

| Class | Color |
|---|---|
| `status-complete` | green `#00b894` |
| `status-draft` | yellow `#fdcb6e` |

## vh48 today

Root `index.html` uses lighter markup:

- `.catalog__card` / `.catalog__card-title` / `.catalog__card-meta`
- Styles in `assets/mockup.css` under `.catalog__*`
- No status/tags badges yet

To port Vaibee badges into vh48:

1. Add optional `status` and ensure `tags` in `catalog.json` entries
2. Extend render script in `index.html` (mirror Vaibee `render()` function)
3. Add badge CSS (dark theme optional; vh48 uses light catalog)

Do not upgrade portal UI unless the user asks — skill only adds catalog entries.
