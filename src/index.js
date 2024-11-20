import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App";
import GlobalHelmetProvider from "./components/common/GlobalHelmetProvider";
import ErrorBoundary from "./core/error/errorBoundary";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import store from "./store/index";

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <HelmetProvider>
        <GlobalHelmetProvider />
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
