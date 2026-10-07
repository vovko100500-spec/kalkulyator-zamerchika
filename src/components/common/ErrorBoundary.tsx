import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('App render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-svh p-4 text-[var(--tg-theme-text-color,#111827)]">
          <h1 className="text-lg font-semibold">Ошибка запуска</h1>
          <p className="mt-2 text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="mt-4 min-h-11 rounded-xl bg-[var(--tg-theme-button-color,#2563eb)] px-4 text-[var(--tg-theme-button-text-color,#fff)]"
            onClick={() => window.location.reload()}
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
