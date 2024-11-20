import { FILEHASHARRAY } from "./type";

const initialState: IFileHashArrayReducer = {
  fileHash: []
};

export const FileHashArrayReducer = (state = initialState, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case FILEHASHARRAY:
      newState.fileHash = action.payload;
      break;
    default:
  }
  return newState;
};

export interface IFileHashArrayReducer {
  fileHash: any[];
}
