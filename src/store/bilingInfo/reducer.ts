import { IonBillInfoResData } from "../../actions/stamp";
import { ADD_BILL_INFO } from "./type";

const initialState: IonBillInfoResData = {
  companyName: "",
  email: "",
  userPlan: {
    name: "",
    minDiscount: 0,
    planId: "",
    price: 0,
    purchaseDate: "",
    purchasePlanType: "",
    totalStamps: 0,
    _id: "",
    discount: 0
  }
};

const billingInfoReducer = (state = initialState, action: { type: string; payload: IonBillInfoResData }) => {
  let newstate = { ...state };
  let { type, payload } = action;
  switch (type) {
    case ADD_BILL_INFO: {
      newstate = payload;
      return newstate;
    }
    default:
      return newstate;
  }
};

export default billingInfoReducer;
