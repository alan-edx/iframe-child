import { combineReducers } from "redux";
import { IonBillInfoResData } from "../actions/stamp";
import { IlabelsReducer, labelsReducer } from "./Labels/reducer";
import authReducer, { IauthReducer } from "./auth/reducer";
import billingInfoReducer from "./bilingInfo/reducer";
import { FileHashArrayReducer, IFileHashArrayReducer } from "./fileHashArray/reducer";
import { IloadingReducer, loadingReducer } from "./loader/reducer";
import planListReducer from "./planList/reducer";
import { ItabReducerFile, tabReducerFile } from "./tab/reducer";
import { ItabReducer, default as tabReducer } from "./tabState/reducer";
import { ItoastReducer, toastReducer } from "./toast/reducer";
import userDetailsReducer, { IuserDetailsReducer } from "./user/reducer";
import userPlanReducer, { IuserPlanReducer } from "./userPlan/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  toaster: toastReducer,
  tabstate: tabReducer,
  userDetails: userDetailsReducer,
  userPlan: userPlanReducer,
  planList: planListReducer,
  billInfo: billingInfoReducer,
  fileHashArray: FileHashArrayReducer,
  currentTab: tabReducerFile,
  labelsReducer: labelsReducer
});

export default rootReducer;

export interface IRootReducer {
  auth: IauthReducer;
  loading: IloadingReducer;
  toaster: ItoastReducer;
  tabstate: ItabReducer;
  userDetails: IuserDetailsReducer;
  userPlan: IuserPlanReducer;
  planList: any;
  billInfo: IonBillInfoResData;
  fileHashArray: IFileHashArrayReducer;
  currentTab: ItabReducerFile;
  labelsReducer: IlabelsReducer;
}
