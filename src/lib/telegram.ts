import {
  bindThemeParamsCssVars,
  expandViewport,
  hapticFeedbackImpactOccurred,
  hapticFeedbackNotificationOccurred,
  init,
  isTMA,
  miniAppReady,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
} from '@telegram-apps/sdk-react';

function applyTelegramThemeToDocument(): void {
  const root = document.documentElement;
  const body = document.body;

  root.style.backgroundColor = 'var(--tg-theme-bg-color, #ffffff)';
  root.style.color = 'var(--tg-theme-text-color, #111827)';
  body.style.backgroundColor = 'var(--tg-theme-bg-color, #ffffff)';
  body.style.color = 'var(--tg-theme-text-color, #111827)';
}

function isInsideTelegram(): boolean {
  try {
    return isTMA();
  } catch {
    return Boolean(window.Telegram?.WebApp?.initData);
  }
}

/**
 * Initializes Telegram Mini App SDK: theme CSS vars, fullscreen expand, ready signal.
 * Safe no-op outside Telegram (PWA / browser).
 */
export function initTelegramApp(): () => void {
  if (!isInsideTelegram()) {
    return () => {};
  }

  let unbindTheme: VoidFunction | undefined;

  try {
    const cleanupInit = init();

    mountMiniAppSync.ifAvailable();
    miniAppReady.ifAvailable();
    mountThemeParamsSync.ifAvailable();

    if (bindThemeParamsCssVars.isAvailable()) {
      unbindTheme = bindThemeParamsCssVars();
    }

    applyTelegramThemeToDocument();

    void mountViewport()
      .then(() => {
        expandViewport.ifAvailable();
      })
      .catch(() => {
        // Viewport mount unavailable in this Telegram client — ignore.
      });

    window.Telegram?.WebApp?.expand?.();

    return () => {
      unbindTheme?.();
      cleanupInit();
    };
  } catch (error) {
    console.warn('Telegram SDK init skipped:', error);
    return () => {};
  }
}

export function hapticLight(): void {
  hapticFeedbackImpactOccurred.ifAvailable('light');
}

export function hapticSuccess(): void {
  hapticFeedbackNotificationOccurred.ifAvailable('success');
}

export function isTelegramMiniApp(): boolean {
  return isInsideTelegram();
}
