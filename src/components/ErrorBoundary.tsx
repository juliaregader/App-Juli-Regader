import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Última barrera antes de una pantalla en blanco: si algo falla al
 * renderizar, se muestra un mensaje legible en vez de un lienzo vacío.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("JuliusCapital render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-subtle px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-brand-900">
            Algo ha fallado al cargar JuliusCapital
          </h1>
          <p className="max-w-md text-sm text-content-muted">
            Recarga la página. Si el problema persiste, contacta con soporte indicando lo que
            estabas haciendo.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
