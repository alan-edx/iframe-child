import { apiEndPoint } from "../api-endpoints";
import HTTPService from "../common/httpService";

export const onNewsLetter = (data: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(apiEndPoint.newsLetterAPI, data)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
