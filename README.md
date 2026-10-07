# Калькулятор замерщика

Telegram Mini App / PWA для полевого расчёта заборов: материалы, монтаж, маржа. Работает офлайн.

## Локальная разработка

```bash
npm install
npm run dev
```

## Продакшен

**URL:** https://vovko100500-spec.github.io/kalkulyator-zamerchika/

Репозиторий: https://github.com/vovko100500-spec/kalkulyator-zamerchika

Деплой на GitHub Pages выполняется автоматически при push в `main` (workflow `.github/workflows/deploy.yml`). Сборка использует `GITHUB_PAGES_BASE=/kalkulyator-zamerchika/`.

Локальная проверка прод-сборки:

```bash
set GITHUB_PAGES_BASE=/kalkulyator-zamerchika/
npm run build
npm run preview
```

### Telegram Mini App

В [@BotFather](https://t.me/BotFather) → ваш бот → **Bot Settings** → **Menu Button** или **Web App** укажите URL:

```
https://vovko100500-spec.github.io/kalkulyator-zamerchika/
```

HTTPS обязателен; ноутбук для работы приложения не нужен.