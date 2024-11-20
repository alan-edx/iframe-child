import { USERDATA } from "./type";

export const onUserDetailsUpdate = (payload: any) => {
  return { type: USERDATA, payload };
};
