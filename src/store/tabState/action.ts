import { SETTABINDEX } from "./type";

export const onTabIndex = (payload: boolean) => {
  return { type: SETTABINDEX, payload };
};
