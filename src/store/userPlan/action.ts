import { USER_PLAN_LIST } from "./type";

export const onUserPlanListInsert = (data: any) => {
  return {
    type: USER_PLAN_LIST,
    payload: data
  };
};
