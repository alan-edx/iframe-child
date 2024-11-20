import { PLAN_LIST_INSERT } from "./type";

export const onPlanListInsert = (data: any) => {
  return {
    type: PLAN_LIST_INSERT,
    payload: data
  };
};
