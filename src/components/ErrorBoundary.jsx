import { Component } from 'react';

// Catches render-time errors anywhere below it and shows a message instead of a
// blank white page. Without this, a single thrown error (e.g. a bad Firebase
// config) unmounts the whole React tree and the user sees nothing.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('FloodBuddy crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="centered">
          <h2 className="centered__title">Something went wrong</h2>
          <p className="centered__sub">
            We hit an unexpected error. Please refresh the page and try again.
          </p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
