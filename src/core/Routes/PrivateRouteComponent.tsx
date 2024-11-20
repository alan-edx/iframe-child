import { useSelector } from "react-redux";
import { getEncryptedCookie } from "../../common/commonFunctions";
import { cookieKeys } from "../../common/constants";
import history from "../../common/history";
import { IRootReducer } from "../../store/root-reducer";

export const PrivateRouteComponent = ({ Route, Redirect, privateRoutes, Switch }: any) => {
  const cookieToken = getEncryptedCookie(cookieKeys.cookieUser);

  const { isLoggedIn } = useSelector((state: IRootReducer) => ({
    isLoggedIn: state.auth.isLoggedIN
  }));

  if (isLoggedIn && !cookieToken) {
    history.push("/");
  } else if (!cookieToken) {
    history.push("/");
  }

  return (
    <Switch>
      {privateRoutes.map((route: any, i: number) => {
        return <Route exact={true} path={route.path} component={route.component} key={i} />;
      })}
      <Redirect to="/dashboard" />
    </Switch>
  );
};
