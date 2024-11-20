import { SETLOADING } from "./type";

const initialState: IloadingReducer = {
  isLoading: false
};

const loadingReducer = (state = initialState, action: { type: string; payload: boolean }) => {
  const newState = { ...state };
  switch (action.type) {
    case SETLOADING:
      newState.isLoading = action.payload;
      break;
  }
  return newState;
};

export { loadingReducer };

export interface IloadingReducer {
  isLoading: boolean;
}
