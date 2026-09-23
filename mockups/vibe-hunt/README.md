# vibe-hunt — VibeHunt click-through mockup

**Status:** draft  
**Date:** 2026-09-07  
**Tags:** vibehunt, career, specialist, mockup

## Идея

Кликабельный макет сайта **VibeHunt** (specialist side), перенесённый из репозитория [VibeHunt88/web](https://github.com/VibeHunt88/web) и [vibehunt-docs/design/vibe-dashboard-mock](https://github.com/VibeHunt88/vibehunt-docs).

Единый flow без перезагрузки: landing → регистрация → кабинет → вайб → отчёты.

## Источники (VibeHunt88)

| Экран | Источник |
|---|---|
| Landing | `web/docs/design-reference/uploads/VibeHunt - Платформа для успешных команд.html` |
| Register | упрощённый onboarding |
| Cabinet | `vibehunt-docs/design/vibe-dashboard-mock/Cabinet.dc.html` (rendered) |
| Vibe | `Main.dc.html` + `vh-career-code.html` |
| Reports | `Reports.dc.html` (rendered) |
| Tokens | `web/src/styles/vh-tokens.css` |

Архив исходников: [prototype/pages/](./prototype/pages/)

## Flow

1. **Landing** — маркетинг, табы «сотрудники / компании»
2. **Register** — регистрация специалиста
3. **Cabinet** — путь Карьерного Кода, прогресс тестов
4. **Vibe** — Карьерный Код, архетип, 4 области
5. **Reports** — список отчётов

## Прототип

Открыть: [index.html](./index.html)

GitHub Pages: `https://make-kzk.github.io/vh048/mockups/vibe-hunt/index.html`

## Связь с Vaibee

- **Конвейер HR** (`conveyor`) — hiring side, использует ту же design system VibeHunt88
- Production SPA: `VibeHunt88/web` (Vite + React)
