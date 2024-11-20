import { SHOWTOAST } from "./type";

const initialState: ItoastReducer = {
  status: "",
  message: ""
};

const toastReducer = (state = initialState, action: { type: string; payload: { type: string; message: string } }) => {
  const newState = { ...state };
  switch (action.type) {
    case SHOWTOAST:
      newState.status = action.payload.type;
      newState.message = action.payload.message;
      break;
  }
  return newState;
};

export { toastReducer };

export interface ItoastReducer {
  status: string;
  message: string;
}
