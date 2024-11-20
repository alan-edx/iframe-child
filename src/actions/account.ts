import { apiEndPoint } from '../api-endpoints'
import HTTPService from '../common/httpService'

const {
  certificateViewAPI,
  credentialAPI,
  downloadAPI,
  hashAPI,
  getProfileDetails,
  iframeRegisterApi,
  iframeLoginApi
} = apiEndPoint

export const getStampList = (params: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.get(hashAPI, { params })
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const downloadFile = (params: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(downloadAPI, params)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const addStampe = (postData: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(hashAPI, postData)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const getHash = (params: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.get(hashAPI, { params })
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const getCredentialkey = (params: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.get(credentialAPI, { params })
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const getProfileUserData = () => {
  return new Promise((resolve, reject) => {
    HTTPService.get(getProfileDetails)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const downloadCertificateAction = (postData: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.put(certificateViewAPI, postData)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

// export const generateKeyAction = (postData: any) => {
//   return new Promise((resolve, reject) => {
//     HTTPService.postAccount(generateKeyAPI, postData)
//       .then((response) => resolve(response))
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

export const registerIframeUser = (postData: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(iframeRegisterApi, postData)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}

export const loginIframeUser = (postData: any) => {
  return new Promise((resolve, reject) => {
    HTTPService.post(iframeLoginApi, postData)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
      })
  })
}