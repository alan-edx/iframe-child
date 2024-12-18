import jwtDecode from 'jwt-decode';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginIframeUser, registerIframeUser } from '../../actions/account';
import { getEncryptedCookie, handleLabelKEY, setEncryptedCookieForIframe } from '../../common/commonFunctions';
import { cookieKeys } from '../../common/constants';
import { setCurrentTab } from "../../store/tab/action";
import { useEffect, useState } from 'react';
export const Dashboard = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const [clientId, setClientId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loader state

  // const clientId = "2e799083-730b-40c9-ada0-d50f8a5c0357"
  // const clientId = "6d4ead19-b011-488c-97e4-b506bf5d6cd2"
  // const clientId = "7db3cc91-7adc-484b-adcc-f6676754bff9"
  // const deviceId = "Yd473Xajz7L6w7uwiL6kSokFwiBcAHuQlJd8PBPbxLrgzqxFNW11cgAqkPTPa6YEyx0qBHxJvlhIxFAxwFg3pA=="; 
  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin !== 'http://localhost:3005') return;
      const { clientId, deviceId } = event.data;
      if (clientId && deviceId) {
        setClientId(clientId);
        setDeviceId(deviceId);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  useEffect(() => {
    if (!clientId || !deviceId) return;

    setIsLoading(true);

    const cookieData = getEncryptedCookie(cookieKeys.cookieUser);

    if (cookieData) {
      try {

        console.log("Removing existing cookie:", cookieData);

        setEncryptedCookieForIframe(cookieKeys.cookieUser, null);

        performLogin();
      } catch (error) {
        console.error("Invalid or expired token, removing cookie:", error);
        setEncryptedCookieForIframe(cookieKeys.cookieUser, null); 
        performLogin(); 
      }
    } else {
      performLogin();
    }
  }, [clientId, deviceId, history, dispatch]);

  const performLogin = () => {
    loginIframeUser({ clientId })
      .then((res: any) => {
        const { status, message, data: { token } } = res;

        if (status === 200) {
          const cookiePayload = {
            token,
            userId: clientId,
            deviceId,
          };
          setEncryptedCookieForIframe(cookieKeys.cookieUser, cookiePayload);
          dispatch(setCurrentTab(0));
          history.push("/account");
        } else {
          console.error("Login response indicates failure:", message);
        }
      })
      .catch((e) => {
        console.error("Login failed:", e);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

const handleClick = () => {
  loginIframeUser({clientId})
      .then((res:any) => {
        const { status, message, data: { token } } = res;
        const cookieData = {
          token,
          userId: clientId,
          deviceId,
        };
        setEncryptedCookieForIframe(cookieKeys.cookieUser,cookieData)
        dispatch(setCurrentTab(2));
        history.push("/account");
      })
      .catch((e) => {
        console.log(e)
      })
};

const registerClick = () => {
  const email = 'aland@yopmail.com'
  registerIframeUser({email})
      .then((res:any) => {
      console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
};



return (
  <div>
    {/* <button onClick={registerClick}> click to login</button> */}
    {isLoading ? (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Loading...</p>
      </div>
    ) : (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Failed to authenticate. Please try again.</p>
      </div>
    )}
  </div>
)};
