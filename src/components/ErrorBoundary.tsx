// React Error Boundary — graceful error display
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to console only, no external service in this build
    if (import.meta.env.DEV) {
      console.error('OrbitPay ErrorBoundary:', error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-slate-400 mb-2">
              We hit an unexpected issue. Your data is safe and wasn't lost.
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-500 mb-6 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={this.reset}
                className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-xl hover:bg-emerald-400 transition inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
              <button onClick={() => window.location.assign('/')}
                className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 inline-flex items-center gap-2">
                <Home className="w-4 h-4" /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
