import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
          <div className="d-flex flex-column ">
            <h1 className="text-center">Oops!</h1>
            <h6 className="text-center fw-bold">Something went wrong</h6>
            <button onClick={(e) => window.location.reload()} className="btn cursor-pointer btn-primary ml-20 mt-2">
              <i className="fas fa-redo small"></i>&nbsp; Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
