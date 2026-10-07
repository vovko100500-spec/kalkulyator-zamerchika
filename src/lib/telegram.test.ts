import { describe, expect, it, vi } from 'vitest';
import { hapticLight, hapticSuccess, initTelegramApp } from './telegram';

vi.mock('@telegram-apps/sdk-react', () => ({
  isTMA: vi.fn(() => false),
  init: vi.fn(() => vi.fn()),
  mountMiniAppSync: { ifAvailable: vi.fn() },
  miniAppReady: { ifAvailable: vi.fn() },
  mountThemeParamsSync: { ifAvailable: vi.fn() },
  bindThemeParamsCssVars: { isAvailable: vi.fn(() => false) },
  mountViewport: vi.fn(() => Promise.resolve()),
  expandViewport: { ifAvailable: vi.fn() },
  hapticFeedbackImpactOccurred: { ifAvailable: vi.fn(() => [false]) },
  hapticFeedbackNotificationOccurred: { ifAvailable: vi.fn(() => [false]) },
}));

describe('telegram helpers', () => {
  it('initTelegramApp does not throw outside Telegram', () => {
    expect(() => initTelegramApp()).not.toThrow();
  });

  it('haptic helpers do not throw outside Telegram', () => {
    expect(() => hapticLight()).not.toThrow();
    expect(() => hapticSuccess()).not.toThrow();
  });
});
