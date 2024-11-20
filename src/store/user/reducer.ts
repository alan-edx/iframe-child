import { AES, enc } from "crypto-js";
import { cookieKeys, localStorageKeys } from "../../common/constants";
import { USERDATA } from "./type";

const decryptData = (data: any) => {
  const bytes = AES.decrypt(data.toString(), cookieKeys.cryptoSecretKey);
  if (bytes.toString()) {
    return JSON.parse(bytes.toString(enc.Utf8));
  }
};

const getDecryptedLocalStorage = (key: string) => {
  if (key) {
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    const localStorageData = localStorage.getItem(keyName);
    if (localStorageData) {
      return decryptData(localStorageData);
    } else {
      return null;
    }
  }
};

const initialState: IuserDetailsReducer = {
  user: getDecryptedLocalStorage(localStorageKeys.isLoggedIn)
};

const userDetailsReducer = (state = initialState, action: { type: String; payload: any }) => {
  const newState = { ...state };

  switch (action.type) {
    case USERDATA:
      newState.user = action.payload;
  }
  return newState;
};

export default userDetailsReducer;

export interface IuserDetailsReducer {
  user: any;
}
