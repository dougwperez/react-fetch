import { Component, useEffect, type ComponentType, type ErrorInfo, type ReactNode } from 'react'
import { push } from '../lib/logStore'

class ErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    push('error', `${error.message}${info.componentStack ?? ''}`)
  }

  render() {
    if (this.state.message !== null) {
      return (
        <div className="run-error">
          <strong>Render failed</strong>
          <pre>{this.state.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

type Props = {
  Component: ComponentType | null
  error: string | null
  userCss: string
  runId: number
  hasRun: boolean
}

export default function Preview({ Component: Rendered, error, userCss, runId, hasRun }: Props) {
  // Wrapping in `.preview-root { ... }` scopes the user's CSS to the preview
  // via native CSS nesting, so `li { }` can't restyle the app chrome.
  useEffect(() => {
    const el = document.createElement('style')
    el.dataset.userCss = 'true'
    el.textContent = `.preview-root { ${userCss} }`
    document.head.append(el)
    return () => el.remove()
  }, [userCss, runId])

  let body: ReactNode

  if (error !== null) {
    body = (
      <div className="run-error">
        <strong>Could not run</strong>
        <pre>{error}</pre>
      </div>
    )
  } else if (!hasRun || Rendered === null) {
    body = (
      <p className="meta empty">
        Press <kbd>Run</kbd> (or <kbd>⌘</kbd>+<kbd>Enter</kbd>) to render your code.
      </p>
    )
  } else {
    body = (
      <ErrorBoundary key={runId}>
        <Rendered />
      </ErrorBoundary>
    )
  }

  return (
    <div className="preview">
      <div className="pane-bar">
        <span className="pane-label">Preview</span>
      </div>
      <div className="preview-body preview-root">{body}</div>
    </div>
  )
}
