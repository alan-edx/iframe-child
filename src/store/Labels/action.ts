import { getGlobalSettings, getLabels } from "../../actions/auth";
import * as TYPE from "./type";
// @ts-ignore
export const getAdminLanguageLabels = () => async (dispatch) => {
  const response: any = await getLabels();
  dispatch({ type: TYPE.FETCH_LABELS, payload: response.data });
};
export const getLabelAction = (payload: any) => {
  return { type: TYPE.FETCH_LABELS, payload };
};
export const changeTheLanguage = (selectedlanguage: string) => {
  return {
    type: TYPE.CHANGE_LANGUAGE,
    payload: selectedlanguage
  };
};
export const getGlobalSettingsAction = () => async (dispatch: any) => {
  const response: any = await getGlobalSettings();
  dispatch({ type: TYPE.FETCH_GLOBAL_SETTINGS, payload: response.data });
};
export const getGlobalSeting = (payload: any) => {
  return { type: TYPE.FETCH_GLOBAL_SETTINGS, payload };
};
