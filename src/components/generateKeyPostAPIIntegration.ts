import axios from "axios";
import { apiEndPoint } from "../api-endpoints";
import { getEncryptedCookie } from "../common/commonFunctions";
import { cookieKeys } from "../common/constants";

export const generateKeyOfApi = async (body: any) => {
  const cookie = getEncryptedCookie(cookieKeys.cookieUser);
  let tokenisHere;
  if (cookie && cookie?.token) {
    // @ts-ignore
    tokenisHere = `Bearer ${cookie?.token}`;
  }
  const config = {
    headers: { Authorization: tokenisHere }
  };

  return await axios.post(process.env.REACT_APP_ACCOUNT_API + apiEndPoint.generateKeyAPI, body, config);
};

export const universeUserInfo = async () => {
  const cookie = getEncryptedCookie(cookieKeys.cookieUser);
  let tokenisHere;
  if (cookie && cookie?.token) {
    // @ts-ignore
    tokenisHere = `Bearer ${cookie?.token}`;
  }
  const config = {
    headers: { Authorization: tokenisHere }
  };
  return await axios.get(process.env.REACT_APP_ACCOUNT_API + apiEndPoint.universeUserInfo, config);
};
