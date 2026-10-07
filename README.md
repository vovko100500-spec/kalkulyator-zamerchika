# Калькулятор замерщика

Telegram Mini App / PWA для полевого расчёта заборов: материалы, монтаж, маржа. Работает офлайн.

## Локальная разработка

```bash
npm install
npm run dev
```

## Продакшен

**URL:** https://kalkulyator-zamerchika.vercel.app

Репозиторий: https://github.com/vovko100500-spec/kalkulyator-zamerchika

Хостинг: Vercel (`pravo-resh-test/kalkulyator-zamerchika`). Деплой при push в `main` — автоматически. Ручной деплой:

```bash
vercel deploy --prod --yes
```

Локальная проверка прод-сборки:

```bash
npm run build
npm run preview
```

### Telegram Mini App

В [@BotFather](https://t.me/BotFather) → ваш бот → **Bot Settings** → **Menu Button** или **Web App** укажите URL:

```
https://kalkulyator-zamerchika.vercel.app
```

HTTPS обязателен; ноутбук для работы приложения не нужен.