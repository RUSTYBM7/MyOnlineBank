/**
 * Global Error Handler Utility
 * Provides centralized error handling for the application
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

// Custom error interface
export interface AppError {
  id: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: number;
  context?: Record<string, unknown>;
  stack?: string;
}

// Error store for tracking errors
class ErrorStore {
  private errors: AppError[] = [];
  private maxErrors = 100;

  add(error: AppError): void {
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  getAll(): AppError[] {
    return [...this.errors];
  }

  getByCategory(category: ErrorCategory): AppError[] {
    return this.errors.filter((e) => e.category === category);
  }

  getRecent(count: number = 10): AppError[] {
    return this.errors.slice(0, count);
  }

  clear(): void {
    this.errors = [];
  }
}

// Global error store instance
export const errorStore = new ErrorStore();

// Error creation helper
export const createAppError = (
  message: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  context?: Record<string, unknown>
): AppError => {
  return {
    id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message,
    severity,
    category,
    timestamp: Date.now(),
    context,
  };
};

// Error logging function
export const logError = (
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  context?: Record<string, unknown>
): AppError => {
  const message = typeof error === 'string' ? error : error.message;
  const stack = typeof error === 'string' ? undefined : error.stack;

  const appError = createAppError(message, severity, category, {
    ...context,
    stack,
  });

  // Log to console based on severity
  switch (severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.ERROR:
      console.error(`[${category.toUpperCase()}] ${message}`, context);
      break;
    case ErrorSeverity.WARNING:
      console.warn(`[${category.toUpperCase()}] ${message}`, context);
      break;
    case ErrorSeverity.INFO:
      console.info(`[${category.toUpperCase()}] ${message}`, context);
      break;
  }

  // Store the error
  errorStore.add(appError);

  return appError;
};

// Network error handler
export const handleNetworkError = (error: unknown): AppError => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return logError(
      'Network connection failed. Please check your internet connection.',
      ErrorSeverity.ERROR,
      ErrorCategory.NETWORK
    );
  }

  if (error instanceof Response) {
    return logError(
      `Server error: ${error.status} ${error.statusText}`,
      ErrorSeverity.ERROR,
      ErrorCategory.SERVER,
      { status: error.status, url: error.url }
    );
  }

  return logError(
    error instanceof Error ? error.message : 'An unknown network error occurred',
    ErrorSeverity.ERROR,
    ErrorCategory.NETWORK
  );
};

// API error handler
export const handleApiError = (
  response: { success: boolean; error?: string; data?: unknown },
  endpoint?: string
): AppError | null => {
  if (response.success === false) {
    return logError(
      response.error || 'API request failed',
      ErrorSeverity.ERROR,
      ErrorCategory.SERVER,
      { endpoint }
    );
  }
  return null;
};

// Validation error handler
export const handleValidationError = (
  errors: Record<string, string[]>,
  context?: Record<string, unknown>
): AppError => {
  const messages = Object.entries(errors)
    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
    .join('; ');

  return logError(
    `Validation failed: ${messages}`,
    ErrorSeverity.WARNING,
    ErrorCategory.VALIDATION,
    { ...context, errors }
  );
};

// Auth error handler
export const handleAuthError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      return logError(
        'Session expired. Please log in again.',
        ErrorSeverity.WARNING,
        ErrorCategory.AUTH
      );
    }
    if (error.message.includes('403')) {
      return logError(
        'Access denied. You do not have permission.',
        ErrorSeverity.WARNING,
        ErrorCategory.AUTH
      );
    }
  }

  return logError(
    error instanceof Error ? error.message : 'Authentication error',
    ErrorSeverity.ERROR,
    ErrorCategory.AUTH
  );
};

// Error boundary fallback renderer
export const renderErrorFallback = (
  error: Error,
  resetError: () => void
): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Something went wrong
          </h1>

          {/* Error Message */}
          <p className="text-slate-400 text-center mb-6">
            We encountered an unexpected error. Please try again or refresh the page.
          </p>

          {/* Error Details (Development Only) */}
          {import.meta.env.DEV && (
            <details className="mb-6">
              <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors">
                Error Details
              </summary>
              <div className="mt-2 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-red-400 text-sm font-mono whitespace-pre-wrap break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 text-xs text-slate-500 overflow-x-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetError}
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export default error handlers
export default {
  logError,
  handleNetworkError,
  handleApiError,
  handleValidationError,
  handleAuthError,
  createAppError,
  errorStore,
  ErrorSeverity,
  ErrorCategory,
};
