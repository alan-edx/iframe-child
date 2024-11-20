import { AES, enc } from "crypto-js";
import toast from "react-hot-toast";
import { getUserInfo } from "../actions/auth";
import { onUserLoggedIn } from "../store/auth/action";
import { setLoading } from "../store/loader/action";
import { onUserDetailsUpdate } from "../store/user/action";
import { cookieExpiresInDays, cookieKeys, localStorageKeys, toasterPosition } from "./constants";
import history from "./history";

const toastSuccess = (message: string) => {
  toast.remove();
  toast.success(message, {
    position: toasterPosition,
    style: {
      color: "#000",
      minWidth: 150,
      padding: 10,
      fontWeight: 500,
      marginBottom: 60,
      border: "1px solid #073E84"
    },
    iconTheme: { primary: "#073E84 ", secondary: "#fff" }
  });
};

export const getDeviceId = () => {
  let navigator_info = window.navigator;
  let screen_info = window.screen;
  let uid: any = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  return (uid += screen_info.pixelDepth || "");
};

const toastError = (message: string) => {
  toast.remove();
  toast.error(message, {
    position: toasterPosition,
    style: {
      color: "#000",
      fontWeight: 500,
      padding: 10,
      marginBottom: 60,
      border: "1px solid #ff0000"
    }
  });
};

export const handleErrors = () => {
  // prevent production and staging console and warnings
  if (process.env.REACT_APP_ENV === "PRODUCTION" || process.env.REACT_APP_ENV === "STAGING") {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
    console.warn = () => {};
  }
};

const getUserDetails = () => {
  const isLoggedIn = getDecryptedLocalStorage(localStorageKeys.isLoggedIn) || "";
  if (isLoggedIn && isLoggedIn !== "") {
    return JSON.parse(isLoggedIn);
  }
};

export const setEncryptedCookie = (key: string, data: any) => {
  if (data && key) {
    const encryptedString = encryptData(data);
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    const date = new Date();
    const expiryTime = new Date(date.setTime(date.getTime() + cookieExpiresInDays * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `${keyName}=${encryptedString};expires=${expiryTime};`;
    // this.localStorageService.set(keyName, encryptedString);
  }
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

export const removeDecryptedCookie = (key: string) => {
  if (key) {
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    document.cookie = `${keyName}=;expires=${new Date(0).toUTCString()};domain=${window.location.hostname.replace("bstamp", "")};path=/;`;
  }
};

export const encryptData = (data: any) => {
  return AES.encrypt(JSON.stringify(data), cookieKeys.cryptoSecretKey);
};

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

const handleLogout = () => {
  localStorage.clear();
  let allCookies = document.cookie.split(";");
  for (var i = 0; i < allCookies.length; i++) {
    document.cookie =
      allCookies[i] + "=;expires=" + new Date(0).toUTCString() + ";domain=" + window.location.hostname.replace(process.env.REACT_APP_ENV === "PRODUCTION" ? "bstamp" : "bstampweb", "") + ";path=/;";
  }
  // window.location.href = "/";
  history.push("/");
};

export const userProfile = (dispatch: any, cookieToken: any) => {
  getUserInfo(cookieToken)
    .then((response: any) => {
      dispatch(setLoading(false));
      setEncryptedLocalStorage(localStorageKeys.userToken, cookieToken);
      setEncryptedLocalStorage(localStorageKeys.isLoggedIn, JSON.stringify(response.data));
      dispatch(onUserDetailsUpdate(JSON.stringify(response.data)));
      dispatch(onUserLoggedIn());
    })
    .catch(() => dispatch(setLoading(false)));
};

export const setEncryptedLocalStorage = (key: string, data: any) => {
  if (data && key) {
    const encryptedString = encryptData(data);
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    localStorage.setItem(keyName, encryptedString.toString());
  }
};

export const getDecryptedLocalStorage = (key: string) => {
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

export const setEncryptedSessionStorage = (key: string, data: any) => {
  if (data && key) {
    const encryptedString = encryptData(data);
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    sessionStorage.setItem(keyName, encryptedString.toString());
  }
};

export const getDecryptedSessionStorage = (key: string) => {
  if (key) {
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    const localStorageData = sessionStorage.getItem(keyName);
    if (localStorageData) {
      return decryptData(localStorageData);
    } else {
    }
  }
};

export const removeLocalStorageKey = (key: string) => {
  if (key) {
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    localStorage.removeItem(keyName);
  }
};

export const checkIfStringIsOnlyWhiteSpace = (string: string) => {
  return !string.replace(/\s/g, "").length;
};

export const handleLabelKEY = (key: string, value: string) => {
  if (key) {
    return key;
  }
  return value;
};

export const getBase64FromFile = (file: File) => {
  return new Promise((resolve, reject) => {
    try {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject("cannot read this file");
      };
    } catch (e) {
      reject("cannot convert this file to base64");
    }
  });
};

export const setEncryptedCookieForIframe = (key: string, data: any) => {
  if (data && key) {
    const encryptedString = encryptData(data);
    const keyName = cookieKeys.cookieInitial + "-" + key.trim();
    const date = new Date();
    const expiryTime = new Date(date.setTime(date.getTime() + cookieExpiresInDays * 24 * 60 * 60 * 1000)).toUTCString();
    const cookiePath = '/';
    const cookieDomain = 'localhost';
    const encCookieData = `${keyName}=${encryptedString}; path=${cookiePath}; domain=${cookieDomain}; SameSite=None; Secure; expires=${expiryTime}`;
    console.log('Sending to parent:', {
      type: 'SET_COOKIE',
      encCookieData: encCookieData,
    });  
    window.parent.postMessage({ type: 'SET_COOKIE', encCookieData }, 'http://localhost:3005');
    // document.cookie = `${keyName}=${encryptedString};expires=${expiryTime};`;
    // this.localStorageService.set(keyName, encryptedString);
  }
};

export { getCookie, getUserDetails, handleLogout, toastError, toastSuccess };

