---
name: create-catalog-card
description: "/create-catalog-card — добавить карточку в каталог vh48: scaffold мокапа, README, запись в catalog.json. Workflow перенесён из Vaibee (SYST/catalog.json + index.html). Use when the user asks to add a mockup card, catalog entry, or new click-through prototype to the portal."
disable-model-invocation: true
---

# /create-catalog-card

Добавляет **карточку мокапа** в портал vh48: папка прототипа → запись в `catalog.json` → карточка на [index.html](../../index.html).

Workflow перенесён из [Vaibee](https://github.com/make-kzk/Vaibee): там карточки research/concept рендерятся из `SYST/catalog.json`; в vh48 — массив `mockups` в корневом `catalog.json`.

---

## Slash command entrypoint

When the user invokes **`/create-catalog-card`** (with optional arguments), follow this flow immediately.

### 1. Parse arguments

| Pattern | Action |
|---|---|
| *(empty)* | Спросить slug, title, summary (или предложить из контекста задачи) |
| `my-flow "My Flow Title"` | slug + title; summary — из контекста или уточнить |
| `my-flow "Title" "One-line summary"` | все три поля заданы |
| `--no-scaffold` | только запись в `catalog.json` (мокап уже есть) |

**Slug rules:** lowercase, `[a-z0-9-]`, без пробелов, уникален в `catalog.json` и в `mockups/`.

### 2. Empty invoke — show menu

```
/create-catalog-card — новая карточка в каталоге

Нужно: slug, title, summary (и опционально tags).

Примеры:
  /create-catalog-card onboarding "HR Onboarding" "Landing → register → cabinet"
  /create-catalog-card reports "Reports flow" --no-scaffold

Или опишите сценарий — соберу поля сам.
```

---

## 3. Execution checklist (vh48)

Выполняй по порядку; отмечай каждый пункт.

### A. Scaffold (если не `--no-scaffold`)

```bash
chmod +x scripts/new-mockup.sh
./scripts/new-mockup.sh {slug} "{title}"
```

Создаёт `mockups/{slug}/index.html`, `style.css` из `templates/prototype/`.

### B. README мокапа

Создай или обнови `mockups/{slug}/README.md` по шаблону Vaibee concept README:

```markdown
# {slug} — {title}

**Status:** draft
**Date:** YYYY-MM-DD
**Tags:** tag1, tag2

## Идея

Одно предложение: что это и для кого.

## Flow

1. …
2. …

## Прототип

Открыть: [index.html](./index.html)
```

### C. Запись в catalog.json

Добавь объект в массив `mockups` (не перезаписывай файл целиком):

```json
{
  "slug": "{slug}",
  "title": "{title}",
  "summary": "{summary — одно предложение, как в Vaibee card-summary}",
  "path": "mockups/{slug}/index.html",
  "tags": ["tag1", "tag2"]
}
```

**Правила (из Vaibee AGENT-PROMPT §8):**

- `slug` совпадает с именем папки в `mockups/`
- `summary` — 1–2 строки для карточки на портале
- `path` — относительный URL от корня репо
- `tags` — lowercase, kebab-case или одно слово
- После правки: JSON валиден (`python3 -m json.tool catalog.json`)

### D. Проверка

- [ ] `mockups/{slug}/index.html` открывается локально
- [ ] Запись есть в `catalog.json`, slug уникален
- [ ] `index.html` (корень) подхватит карточку через fetch `catalog.json`
- [ ] README мокапа ссылается на prototype

---

## 4. Как рендерится карточка

Корневой `index.html` читает `catalog.json` и строит ссылки:

```html
<a class="catalog__card" href="{path}">
  <div class="catalog__card-title">{title}</div>
  <div class="catalog__card-meta">{summary}</div>
</a>
```

В Vaibee (`make-kzk/Vaibee/index.html`) карточки богаче: status-badge, tags, секции Concepts / Research. При необходимости расширить UI vh48 — см. [references/vaibee-portal.md](./references/vaibee-portal.md).

---

## 5. Маппинг Vaibee → vh48

| Vaibee | vh48 |
|---|---|
| `SYST/templates/concept` | `templates/prototype/` |
| `PRDT/concepts/{slug}/` | `mockups/{slug}/` |
| `PRDT/concepts/{slug}/prototype/index.html` | `mockups/{slug}/index.html` |
| `SYST/catalog.json` → `"concepts"` | `catalog.json` → `"mockups"` |
| `SYST/catalog.json` → `"research"` | *(нет в vh48 — только мокапы)* |
| Портал `index.html` | `index.html` |

**Research-карточка в Vaibee** (для справки): `cp -r SYST/templates/research RSCH/.../products/{slug}` + запись в `"research"` с полем `path` на README.

**Concept-карточка в Vaibee:** `cp -r SYST/templates/concept PRDT/concepts/{slug}` + запись в `"concepts"` + прототип в `prototype/`.

---

## 6. Типичные user phrases

| Фраза пользователя | Действие |
|---|---|
| «Добавь мокап в каталог» | Полный checklist §3 |
| «Создай карточку для …» | §3 + уточни flow в README |
| «Залогируй в catalog.json» | Только §3C (если папка уже есть) |
| «Как в Vaibee» | §5 + optional badges из vaibee-portal.md |

---

## 7. Чего не делать

- Не ломать JSON в `catalog.json` (всегда проверять `json.tool`)
- Не дублировать slug
- Не менять `index.html` без запроса (карточки подтягиваются из JSON)
- Не добавлять сборку/npm — vh48 статический

---

## 8. Related paths

| Path | Purpose |
|---|---|
| [references/catalog-schema.md](./references/catalog-schema.md) | Поля catalog.json (vh48 + Vaibee) |
| [references/vaibee-portal.md](./references/vaibee-portal.md) | UI карточек Vaibee для будущего апгрейда |
| `scripts/new-mockup.sh` | Scaffold мокапа |
| `templates/prototype/` | HTML/CSS шаблон |
| `catalog.json` | Индекс карточек |
| `index.html` | Портал |
