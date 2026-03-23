import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, you could send this to an error reporting service
    // e.g. Sentry.captureException(error, { extra: info })
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info.componentStack)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100svh",
          padding: "2rem",
          fontFamily: "'Geist Variable', system-ui, sans-serif",
          background: "var(--color-background, #0a0f1e)",
          color: "var(--color-foreground, #e5e7eb)",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              opacity: 0.7,
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#fff",
                color: "#0a0f1e",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "inherit",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
