import { CURRENTTAB } from "./type";

export const setCurrentTab = (payload: any) => {
  return { type: CURRENTTAB, payload };
};
