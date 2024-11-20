import { SETTABINDEX } from "./type";

const initialState: ItabReducer = {
  status: false,
  index: 0
};

const tabReducer = (state = initialState, action: { type: string; payload: any }) => {
  const newState = { ...state };
  switch (action.type) {
    case SETTABINDEX:
      newState.status = action.payload.status;
      newState.index = action.payload.index;
      break;
  }
  return newState;
};

export default tabReducer;

export interface ItabReducer {
  status: boolean;
  index: number;
}
