import * as TYPE from "./type";

export const onUserLoggedIn = () => {
  return { type: TYPE.LOGGEDIN };
};

export const onUserLogOut = () => {
  return { type: TYPE.LOGOUT };
};
