# vh48

Инструментарий для **интерактивных кликабельных мокапов** — без сборки, только HTML + CSS + один JS-роутер.

## Live

**https://make-kzk.github.io/vh048/**

- [Каталог мокапов](https://make-kzk.github.io/vh048/)
- [**VibeHunt — дизайн-система**](https://make-kzk.github.io/vh048/design-system/vibehunt/) — токены и компоненты из мокапа
- [**Альтернативная дизайн-система**](https://make-kzk.github.io/vh048/design-system/) — презентации Marketing & Reputation Day
- [**AI Hiring Deck (Презентация)**](https://make-kzk.github.io/vh048/mockups/vibe-hunt/ai-hire-deck.html) — слайды презентации платформы
- [**VibeHunt mockup**](https://make-kzk.github.io/vh048/mockups/vibe-hunt/index.html) — из VibeHunt88/web
- [Demo flow](https://make-kzk.github.io/vh048/mockups/demo/index.html) — упрощённый пример на vh48-роутере

### Одноразовая настройка GitHub Pages (как у [Vaibee](https://make-kzk.github.io/Vaibee/))

1. **Settings → General → Danger Zone → Change visibility → Public**  
   (без public Pages не откроется анонимно)
2. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`main`** / **`/ (root)`**
3. Подождите 1–2 мин — сайт появится по ссылке выше

Сборка не нужна: статические HTML/CSS/JS из корня репозитория.

## Быстрый старт

### Локальный прототип

```bash
cd vh48
./scripts/start-local.sh
```

Откройте **http://127.0.0.1:8080/local/** — hub с ссылками на все мокапы.

| Мокап | Локальный URL |
|-------|---------------|
| **VibeHunt** | http://127.0.0.1:8080/mockups/vibe-hunt/index.html |
| Demo flow | http://127.0.0.1:8080/mockups/demo/index.html |
| Каталог | http://127.0.0.1:8080/ |

### Online (GitHub Pages)

1. Откройте [каталог](https://make-kzk.github.io/vh048/) или [VibeHunt](https://make-kzk.github.io/vh048/mockups/vibe-hunt/index.html)
2. Локально без скрипта (опционально):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Новый мокап

```bash
chmod +x scripts/new-mockup.sh
./scripts/new-mockup.sh my-flow "My Flow Title"
```

Добавьте запись в [`catalog.json`](./catalog.json):

```json
{
  "slug": "my-flow",
  "title": "My Flow Title",
  "summary": "Краткое описание сценария.",
  "path": "mockups/my-flow/index.html",
  "tags": []
}
```

## Структура

```
vh48/
├── assets/
│   ├── mockup.css   # общие стили (кнопки, экраны, карточки, табы)
│   └── mockup.js    # роутер экранов (VH48Mockup)
├── catalog.json     # список мокапов для index.html
├── index.html       # каталог
├── mockups/         # готовые прототипы
│   └── demo/
├── scripts/
│   └── new-mockup.sh
└── templates/
    └── prototype/   # шаблон для копирования
```

## Как работает навигация

| Атрибут | Назначение |
|---------|------------|
| `data-screen="id"` | Экран (section). Один с классом `active` — стартовый |
| `data-nav="id"` | Переход на экран |
| `data-nav="back"` | Шаг назад по history stack |
| `data-mockup-back` | Кнопка «Назад» (скрывается на home) |
| `data-nav-active="id"` | Подсветка пункта bottom-nav |
| `data-toggle-group` + `data-toggle-target` | Табы |
| `data-toggle-panel` | Панель таба (значение = target) |
| `body[data-mockup-home]` | ID домашнего экрана |
| `?screen=id` | Deep link (синхронизируется с history) |

## Пример экрана

```html
<section class="screen active" data-screen="landing" data-screen-title="Landing">
  <h2>Заголовок</h2>
  <button type="button" class="btn btn--primary" data-nav="register">Далее</button>
</section>
```

## Demo flow

Демо повторяет типичный путь VibeHunt:

**Landing → Register → Cabinet → Test (3 шага) → Result → Reports**

Включены табы на лендинге, выбор ответа в тесте, bottom-nav и URL-sync (`?screen=`).

## Связь с VibeHunt88

Для production-уровня макетов с design system VibeHunt см. [`VibeHunt88/web`](https://github.com/VibeHunt88/web) и прототипы в [`make-kzk/vaibee`](https://github.com/make-kzk/vaibee).
