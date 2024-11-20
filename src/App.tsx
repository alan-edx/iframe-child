import { Theme, ThemeProvider, createStyles, makeStyles } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { Suspense, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "../src/@config/Theme";
import "./App.css";
import CircularIndeterminate from "./Pages/common/loader";
import { getDecryptedSessionStorage } from "./common/commonFunctions";
import { sessionStorageKeys } from "./common/constants";
import RoutingComponent from "./core/Routes/routing";
import { getAdminLanguageLabels, getGlobalSeting, getGlobalSettingsAction, getLabelAction } from "./store/Labels/action";
import { IRootReducer } from "./store/root-reducer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    }
  })
);

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoader } = useSelector((state: IRootReducer) => ({
    isLoader: state.loading.isLoading
  }));

  const internationalizeTheApp = useCallback(() => {
    // if we already have localstorage of languages array then use it.
    let data = getDecryptedSessionStorage(sessionStorageKeys.languageKey);
    if (data && getDecryptedSessionStorage(sessionStorageKeys.userLangKey)) {
      dispatch(getLabelAction(getDecryptedSessionStorage(sessionStorageKeys.languageKey)));
    } else {
      dispatch(getAdminLanguageLabels());
    }
    let globalData = getDecryptedSessionStorage(sessionStorageKeys.globalSetKey);
    if (globalData) {
      dispatch(getGlobalSeting(getDecryptedSessionStorage(sessionStorageKeys.globalSetKey)));
    } else {
      dispatch(getGlobalSettingsAction());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    internationalizeTheApp();
    dispatch(getGlobalSettingsAction());
    // eslint-disable-next-line
  }, []);

  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {isLoader && (
        <Backdrop className={classes.backdrop} open={isLoader}>
          <CircularIndeterminate />
        </Backdrop>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover={false} />

      {/* @ts-ignore */}
      <Suspense fallback={<h3>Loading...</h3>}>
        <RoutingComponent />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
