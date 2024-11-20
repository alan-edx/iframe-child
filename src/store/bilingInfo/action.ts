import { IonBillInfoResData } from "./../../actions/stamp";
import { ADD_BILL_INFO } from "./type";

export const onAddBillInfo = (data: IonBillInfoResData) => {
  return {
    type: ADD_BILL_INFO,
    payload: data
  };
};
