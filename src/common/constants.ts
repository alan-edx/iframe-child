export const universityDomains = ["universityfl.io-world.com"];
export const onlyNumberPattern = /^[+]{0,1}[0-9]+$/;
export const toasterColorCode = "#1e84c5";
export const messageMaxCharactersCount = 160;
export const subjectMaxCharactersCount = 80;
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
export const composeFileUploadLimit = 1;
export const defaultCountryCode = "ch";
export const toasterPosition = "bottom-left";
export const debounceTimeInMilliseconds = 500;
export const cookieExpiresInDays = 7;
export const maxFileSize = 1024 * 1024 * 100;
export const fileSizeToShowLoader = 1024 * 1024 * 20;
export const metaDataKeyValueLimit = {
  label: 20,
  value: 150
};

export const maxFilesToStamp = {
  number: 10,
  message: "Maximum 10 files allowed to validate"
};
export const qrCodeConfig = {
  ecLevel: "M",
  size: 130,
  qrStyle: "squares",
  fgColor: "#1e84c5",
  logoHeightWidth: 18
};

export const sessionStorageKeys = {
  languageKey: "langauges",
  userLangKey: "userLanguageKey",
  globalSetKey: "globalSettingkey"
};

export const localStorageKeys = {
  isLoggedIn: "isLoggedIn",
  isAvailableApps: "isAvailableApps",
  currentEmail: "currentEmail",
  labels: "webLabels",
  textLabels: "textLabels",
  currentLanguage: "currentLanguage",
  universityStudentIDAndPolls: "universityStudentIDAndPolls",
  bStampToken: "bStampToken",
  cookieToken: "cookieToken",
  userToken: "userToken",
  transactionSuccess: "transactionSuccess",
  iframeUserToken: "iframeUserToken"
};

export const cookieKeys = {
  cryptoSecretKey: "edexaUser",
  cookieInitial: "edexa",
  cookieUser: "CookieUser"
};

export const labelKeys = {
  validateVote: "validateVote",
  auth: "auth",
  createPoll: "createPoll",
  pollResult: "pollResult",
  commonLabels: "commonLabels",
  toasterMessages: "toasterMessages",
  validations: "validations",
  universityStudentIDAndPolls: "universityStudentIDAndPolls",
  dashboard: "dashboard"
};

export const toasterMessage = {
  stampSuccess: "Document stamped successfully",
  copied: "Copied!",
  maxFileSizeWarning: "Maximum allowed file size is 100 MB",
  fileAlreadyExists: "Your file already exists",
  duplicateFileError: "You have selected duplicate files",
  somethingWentWrong: "Something went wrong!",
  loginInRequired: "You need to login to access this feature",
  fillRequiredFields: "Please fill missing fields"
};

export const metaTitle = {
  validatePage: "Validate Hash |",
  submitPoll: "poll |",
  pollResult: "Poll Result |",
  dashboard: "dashboard |",
  verify: "verify |",
  login: "Login |",
  register: "Register |",
  forgotpassword: "Forgot Password |",
  resetpassword: "Reset Password |"
};

export const preferredLanguage = "EN";

export const fileFormats = {
  image: ["png", "jpg", "jpeg", "webp", "gif", "bmp", "png", "webp", "ico"],
  video: ["mp4", "mkv", "mov", "webm", "ogg", "wbem", "flv", "avi", "mpg", "mpv", "m4p", "m4v", "quicktime"],
  audio: ["mp3", "wave", "wav", "mpeg", "aac", "amr", "3gp", "ogg", "mid", "imy", "m4a"],
  pdf: ["pdf"]
};

export const validationMessages = {
  email: {
    required: "e-mail is required",
    invalid: "Enter a valid email"
  }
};

export const waterMarkPosition = ["Top", "Bottom"];
