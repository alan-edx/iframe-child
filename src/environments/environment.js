export const environment = {
  APIBASEURL: process.env.REACT_APP_APIBASEURL,
  CUSTOMER_PORTAL_DOMAIN: process.env.REACT_APP_CUSTOMER_PORTAL_DOMAIN,
  accountsAPIEndpoint: process.env.REACT_APP_accountsAPIEndpoint,
  // ACCOUNT_API: process.env.REACT_APP_ACCOUNT_API,
  DOMAINUrl: process.env.REACT_APP_DOMAINUrl,
  profileURL: process.env.REACT_APP_accountsURL,
  accountURL: process.env.REACT_APP_ACCOUNT_URL,

  authWithEdexa: {
    login: process.env.REACT_APP_authWithEdexa_login,
    register: process.env.REACT_APP_authWithEdexa_register
  },

  privacy: process.env.REACT_APP_privacy,
  tCondition: process.env.REACT_APP_tCondition,

  winApplication: process.env.REACT_APP_winApplication,
  msApplication: process.env.REACT_APP_msApplication,
  chromeExtension: process.env.REACT_APP_chromeExtension,

  appsDomain: {
    banjiDomain: process.env.REACT_APP_appsDomain_banjiDomain,
    portalDomain: process.env.REACT_APP_appsDomain_portalDomain,
    bMessageDomain: process.env.REACT_APP_appsDomain_bMessageDomain,
    bVoteDomain: process.env.REACT_APP_appsDomain_bVoteDomain,
    explorerDomain: process.env.REACT_APP_appsDomain_explorerDomain
  },

  amazonS3BetaURL: process.env.REACT_APP_amazonS3BetaURL,
  amazonS3LiveURL: process.env.REACT_APP_amazonS3LiveURL
};
