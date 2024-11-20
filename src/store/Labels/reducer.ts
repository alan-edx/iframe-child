import { setEncryptedSessionStorage } from "../../common/commonFunctions";
import { sessionStorageKeys } from "../../common/constants";
import { CHANGE_LANGUAGE, FETCH_GLOBAL_SETTINGS, FETCH_LABELS } from "./type";

const startingState: IlabelsReducer = {
  labels: {
    EN: {},
    DE: {}
  },
  lang_: "English",
  globalSettings: {}
};

export const labelsReducer = (state = startingState, action: any) => {
  switch (action.type) {
    case FETCH_LABELS:
      setEncryptedSessionStorage(sessionStorageKeys.languageKey, action.payload);
      return { ...state, labels: action.payload };
    case CHANGE_LANGUAGE:
      setEncryptedSessionStorage(sessionStorageKeys.userLangKey, action.payload);
      return { ...state, lang_: action.payload };
    case FETCH_GLOBAL_SETTINGS:
      setEncryptedSessionStorage(sessionStorageKeys.globalSetKey, action.payload);
      return { ...state, globalSettings: action.payload };
    default:
      return state;
  }
};

interface IlabelsReducerLabel {
  EN: any;
  DE: any;
}

export interface IlabelsReducer {
  labels: IlabelsReducerLabel;
  lang_: string;
  globalSettings: any;
}
