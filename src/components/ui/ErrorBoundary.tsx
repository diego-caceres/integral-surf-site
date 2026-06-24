"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered in place of the children when they throw. Defaults to nothing. */
  fallback?: ReactNode;
  /** Optional label to make dev logs easier to trace. */
  name?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates render failures to a subtree. If a wrapped section throws (e.g. a
 * component maps over data that came back degraded), only that section is
 * replaced by `fallback` (nothing by default) — the rest of the page still
 * renders, instead of React unmounting the whole tree to a white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      const label = this.props.name ? `:${this.props.name}` : "";
      console.error(`[ErrorBoundary${label}]`, error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
