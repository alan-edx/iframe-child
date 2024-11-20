import { apiEndPoint } from "../api-endpoints";
import HTTPService from "../common/httpService";
const { billInfoAPI, createPaymentAPI, multiHashAPI, plansAPI, userPlanAPI } = apiEndPoint;

export const onPlanList = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(plansAPI)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const onBillInfo = (params: { billingId: string }): Promise<IonBillInfoRes> => {
  return new Promise((resolve, reject) => {
    HTTPService.get(billInfoAPI, { params })
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export interface IonBillInfoResData {
  companyName: string;
  email: string;
  userPlan: {
    discount: number;
    minDiscount: number;
    name: string;
    planId: string;
    price: number;
    purchaseDate: string;
    purchasePlanType: string;
    totalStamps: number;
    _id: string;
  };
}

interface IonBillInfoRes {
  status: number;
  message: string;
  data: IonBillInfoResData;
}

export const onUserPlanList = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(userPlanAPI)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const onCreatePayment = (params: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(createPaymentAPI, params)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkMultiHash = (hashArray: Array<string>) => {
  return HTTPService.post(multiHashAPI, hashArray);
};
