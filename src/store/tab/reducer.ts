import { CURRENTTAB } from "./type";

const initialState: ItabReducerFile = {
  tabindex: 0
};

export const tabReducerFile = (state = initialState, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case CURRENTTAB:
      newState.tabindex = action.payload;
      break;

    default:
  }
  return newState;
};

export interface ItabReducerFile {
  tabindex: number;
}
