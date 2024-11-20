import { Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import * as io from 'socket.io-client'
import Undermaintenance from '../../Pages/common/undermaintenance'
import { getUserInfo } from '../../actions/auth'
import {
  getDecryptedLocalStorage,
  getEncryptedCookie,
  setEncryptedLocalStorage,
  userProfile
} from '../../common/commonFunctions'
import { cookieKeys, localStorageKeys } from '../../common/constants'
import { environment } from '../../environments/environment'
import useAuthCookieWatcher from '../../hooks/useCookieWatcher'
import { onUserLogOut, onUserLoggedIn } from '../../store/auth/action'
import { setLoading } from '../../store/loader/action'
import { IRootReducer } from '../../store/root-reducer'
import { onUserDetailsUpdate } from '../../store/user/action'
import { PrivateRouteComponent } from './PrivateRouteComponent'
import { PublicRouteComponent } from './PublicRouteComponent'
import { privateRoutes, publicRoutes } from './routes'


function RoutingComponent() {
  // prevent console logs and errors
  // handleErrors()
  const dispatch = useDispatch()
  const { underMaintenance } = useSelector(
    (state: IRootReducer) => state.labelsReducer.globalSettings
  )
  const { isLoggedIn, userData } = useSelector(
    (state: IRootReducer) => ({
      isLoggedIn: state.auth.isLoggedIN,
      userData: state.userDetails.user
    })
  )
  let socket = io.io(environment.accountsAPIEndpoint || '', {
    path: '/socket.io',
    transports: ['websocket', 'polling']
  })

  const listenToSocketChanges = (userId: string) => {
    socket.on(`userInfo_${userId}`, (data) => {
      const stringifiedData = JSON.stringify(data)
      setEncryptedLocalStorage(
        localStorageKeys.isLoggedIn,
        stringifiedData
      )
      dispatch(onUserDetailsUpdate(stringifiedData))
    })
  }

  const getUserData = (cookieToken: string) => {
    getUserInfo(cookieToken)
      .then((response: any) => {
        dispatch(setLoading(false))
        setEncryptedLocalStorage(
          localStorageKeys.userToken,
          cookieToken
        )
        setEncryptedLocalStorage(
          localStorageKeys.isLoggedIn,
          JSON.stringify(response.data)
        )
        dispatch(onUserDetailsUpdate(JSON.stringify(response.data)))
        dispatch(onUserLoggedIn())
      })
      .catch(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    const cookieToken = getEncryptedCookie(cookieKeys.cookieUser)
    const token = getDecryptedLocalStorage(localStorageKeys.userToken)
    if (!cookieToken) {
      dispatch(onUserLogOut())
    } else {
      if (!userData) {
        getUserData(cookieToken)
      }
      listenToSocketChanges(cookieToken.userId)
      if (cookieToken.token !== token) {
        setEncryptedLocalStorage(
          localStorageKeys.userToken,
          cookieToken.token
        )
        userProfile(dispatch, cookieToken.token)
      }
    }
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  // check if user auth cookie changes/deleted then logout him from current app.
  // ⚠ Be cautious while using this hook because it can keep your user logged-out in loop
  const { exist } = useAuthCookieWatcher(
    `${cookieKeys.cookieInitial}-${cookieKeys.cookieUser}`,
    1000
  )
  useEffect(() => {
    // if the user is logged in but the auth cookie dosen't exist that means he is logged out from some other subdomains so logout him from current app too.
    if (!exist && isLoggedIn) {
      dispatch(onUserLogOut())
    } else if (exist && !isLoggedIn) {
      const cookieToken = getEncryptedCookie(cookieKeys.cookieUser)
      userProfile(dispatch, cookieToken.token)
    }
    // eslint-disable-next-line
  }, [exist, isLoggedIn])

  useEffect(() => {
    return () => {
      socket.removeAllListeners()
      socket.close()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Toaster />
      <Suspense fallback={<p>Loading...</p>}>
        <Router>
          {underMaintenance === 1 ? (
            <Undermaintenance />
          ) : isLoggedIn ? (
            <>
              {userData && (
                <PrivateRouteComponent
                  Route={Route}
                  Redirect={Redirect}
                  privateRoutes={privateRoutes}
                  Switch={Switch}
                />
              )}
            </>
          ) : (
            <PublicRouteComponent
                  Route={Route}
                  Redirect={Redirect}
                  publicRoutes={publicRoutes}
                  Switch={Switch} />
          )}
        </Router>
      </Suspense>
    </>
  )
}

export default RoutingComponent
