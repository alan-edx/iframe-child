import { SETLOADING } from "./type";

export const setLoading = (payload: boolean) => {
  return { type: SETLOADING, payload };
};
