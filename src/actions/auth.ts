import axios from "axios";
import { apiEndPoint } from "../api-endpoints";
import { getEncryptedCookie } from "../common/commonFunctions";
import { cookieKeys } from "../common/constants";
import HTTPService from "../common/httpService";
import { environment } from "../environments/environment";

const { getAllAvailableApplication, getUserInfoAPI, logoutAPI, adminGetLabels, adminGlobalSettings } = apiEndPoint;

export const getUserInfo = (token: string) => {
  const headers = {
    Authorization: token
  };
  return new Promise((resolve, reject) => {
    HTTPService.get(getUserInfoAPI, { headers: headers })
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllApplication = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(getAllAvailableApplication)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const getLabels = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(adminGetLabels)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const getGlobalSettings = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(adminGlobalSettings)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const userLogout = () => {
  const cookieUserObject = getEncryptedCookie(cookieKeys.cookieUser);
  return axios.post(environment.accountsAPIEndpoint + "/" + logoutAPI, {}, { headers: { Authorization: `Bearer ${cookieUserObject.token}` } });
};
