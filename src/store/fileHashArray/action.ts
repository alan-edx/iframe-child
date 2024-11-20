import { FILEHASHARRAY } from "./type";

export const sendFileHashArray = (payload: any) => {
  return { type: FILEHASHARRAY, payload };
};
