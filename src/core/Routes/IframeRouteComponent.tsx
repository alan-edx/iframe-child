
import { getDecryptedLocalStorage } from "../../common/commonFunctions";
import { cookieKeys, localStorageKeys } from "../../common/constants";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router";

export const IframeRouteComponent = ({ Route, Redirect, iframeRoutes, Switch }: any) => {
 const history = useHistory()
  const userToken = getDecryptedLocalStorage(localStorageKeys.iframeUserToken);
  console.log(userToken, "----------*********")
  if (!userToken) {
    history.push("/");
    console.error("User token is missing or invalid");
    return null; // Stop rendering the component
  }
  const decodedToken:any = jwtDecode(userToken);

  if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
    history.push("/");
    console.error('Token has expired');
  } else {
    // Use the token data
    history.push("/iframe-dashboard");
   
    console.log('User ID:', decodedToken);
  }

  return (
    <Switch>
      {iframeRoutes.map((route: any, i: number) => {
        return <Route exact={true} path={route.path} component={route.component} key={i} />;
      })}
      <Redirect to="/iframe-dashboard" />
    </Switch>
  );
};
