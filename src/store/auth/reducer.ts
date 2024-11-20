import { AES, enc } from "crypto-js";
import { handleLogout } from "../../common/commonFunctions";
import { cookieKeys } from "../../common/constants";
import { LOGGEDIN, LOGOUT } from "./type";

export const decryptData = (data: any) => {
  const bytes = AES.decrypt(data.toString(), cookieKeys.cryptoSecretKey);
  if (bytes.toString()) {
    return JSON.parse(bytes.toString(enc.Utf8));
  }
};

const getCookie = (cookieName: any) => {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  if (decodedCookie) {
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      while (c.charAt(0) === "") {
        c = c.substring(1);
      }
      if (+c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return "";
};

export const getEncryptedCookie = (key: string) => {
  if (key) {
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    const cookieData = getCookie(keyName);
    if (cookieData) {
      return decryptData(cookieData);
    }
  }
};

const isUserLoggedIn = () => {
  const cookie = getEncryptedCookie(cookieKeys.cookieUser);
  if (cookie && cookie?.token) {
    return true;
  } else {
    return false;
  }
};

const initialState: IauthReducer = {
  isLoggedIN: isUserLoggedIn()
};

const authReducer = (state = initialState, action: { type: string }) => {
  const newState = { ...state };

  switch (action.type) {
    case LOGGEDIN:
      newState.isLoggedIN = true;
      break;

    case LOGOUT:
      handleLogout();
      newState.isLoggedIN = false;
      break;
  }
  return newState;
};

export default authReducer;

export interface IauthReducer {
  isLoggedIN: boolean;
}
