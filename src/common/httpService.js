import axios from "axios";
import { useDispatch } from "react-redux";
import { getDecryptedSessionStorage, getEncryptedCookie } from "../../src/common/commonFunctions";
import { cookieKeys, localStorageKeys, sessionStorageKeys } from "../../src/common/constants";
import store from "../../src/store/index";
import { environment } from "../environments/environment";
import { onUserLogOut } from "../store/auth/action";
import { setLoading } from "../store/loader/action";
import { toastError, userProfile } from "./commonFunctions";
import history from "./history";

const axiosInstance = axios.create();

const errorInterceptor = (errorResponse) => {
  console.log("err", errorResponse?.data);
  store.dispatch(setLoading(false));
  const cookieToken = getEncryptedCookie(cookieKeys.cookieUser);

  // if (status !== 401 && status !== 404 && status !== 406) {
  //   toastError(message);
  // }
  // if (status === 401) {
  //   store.dispatch(onUserLogOut());
  // } else if (status === 406) {
  //   userProfile(useDispatch, cookieToken.token);
  // } else if (status === 423) {
  //   toastError(message);
  //   localStorage.clear();
  //   history.push("/unauthorized");
  // }

  // re-designed code for better understanding
  if (errorResponse?.data?.status === 401) {
    store.dispatch(onUserLogOut());
    history.push("/");
  } else if (errorResponse?.data?.status === 406) {
    userProfile(useDispatch, cookieToken.token);
  } else if (errorResponse?.data?.status === 423) {
    toastError(errorResponse?.data?.message);
    localStorage.clear();
    history.push("/unauthorized");
  } else {
    if (errorResponse?.data?.status !== 404) {
      if (errorResponse?.data?.message) {
        toastError(errorResponse?.data?.message);
      } else {
        toastError("Oops! Something went wrong");
      }
    }
  }
};

axiosInstance.defaults.baseURL = environment.APIBASEURL;
axiosInstance.interceptors.request.use(
  (req) => {
    const cookie = getEncryptedCookie(cookieKeys.cookieUser);
    if (cookie && cookie.token) {
      req.headers.Authorization = `Bearer ${cookie.token}`;
    }

    const sesssionStorageOfLang = getDecryptedSessionStorage(sessionStorageKeys.userLangKey);

    const prefferedLanguage = sessionStorage.getItem(localStorageKeys.currentLanguage);
    req.headers["X-L10N-Locale"] = prefferedLanguage;
    req.headers["lang_"] = sesssionStorageOfLang;

    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (req) => {
    return req;
  },
  (err) => {
    errorInterceptor(err.response);
    return Promise.reject(err);
  }
);

export default class HTTPService {
  static get(url, params) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(url, params)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static put(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(url, body)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static post(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(url, body)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static delete(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .delete(url, { data: body })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  // static postAccount(url, body) {
  //   axiosInstance.defaults.baseURL = environment.ACCOUNT_API;
  //   return new Promise((resolve, reject) => {
  //     axiosInstance
  //       .post(url, body)
  //       .then((response) => {
  //         axiosInstance.defaults.baseURL = environment.APIBASEURL;
  //         resolve(response.data);
  //       })
  //       .catch((error) => reject(error.response || error));
  //   });
  // }
}
