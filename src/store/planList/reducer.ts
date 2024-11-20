import { PLAN_LIST_INSERT } from "./type";

const initialState: any = [];

const planListReducer = (state = initialState, action: any) => {
  let newstate = [...state];
  let { type, payload } = action;
  switch (type) {
    case PLAN_LIST_INSERT: {
      newstate = payload;
      return newstate;
    }
    default:
      return newstate;
  }
};

export default planListReducer;
