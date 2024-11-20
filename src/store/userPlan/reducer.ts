import { USER_PLAN_LIST } from "./type";

const initialState: IuserPlanReducer = {
  planName: "",
  totalStamps: "",
  perFile: "",
  usedStamps: "",
  userSubscription: []
};

const userPlanReducer = (state = initialState, action: any) => {
  let newstate = { ...state };
  let { type, payload } = action;
  switch (type) {
    case USER_PLAN_LIST: {
      newstate = payload;
      return newstate;
    }
    default:
      return newstate;
  }
};

export default userPlanReducer;
export interface IuserPlanReducer {
  planName: string;
  totalStamps: string;
  perFile: string;
  usedStamps: string;
  userSubscription: any[];
}
