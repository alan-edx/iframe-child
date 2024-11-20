import { SHOWTOAST } from "./type";

export const showToast = (payload: { type: String; message: string }) => {
  return { type: SHOWTOAST, payload };
};
