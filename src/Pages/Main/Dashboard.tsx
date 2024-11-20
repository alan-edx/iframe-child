import jwtDecode from 'jwt-decode';

import {registerIframeUser, loginIframeUser} from '../../actions/account'
import { setEncryptedLocalStorage } from '../../common/commonFunctions';
import { localStorageKeys } from '../../common/constants';
import { useHistory } from "react-router";
export const Dashboard = () => {
  const history = useHistory()
 const handleClick = () => {
  const clientId = "2e799083-730b-40c9-ada0-d50f8a5c0357"
  loginIframeUser({clientId})
      .then((res:any) => {
        const { status, message, data: { token } } = res;
        console.log(token, "---**** token from")
        setEncryptedLocalStorage(localStorageKeys.iframeUserToken, token);
        validateUser(token)
      })
      .catch((e) => {
        console.log(e)
      })
  // const cookieName = 'edexa-CookieUser';
  // const cookieValue = 'U2FsdGVkX1/NQdDWPnEuaYMZR258gr90yOuGRJp/mC6WR5F8/nY2i+UsSt+41OUWYVxwWVmFr4S1cjRgYpUAhqPu3ATEzYfivl3PdxxkUYpgq9oBgcgDleL7JFBSuGQZm0LUTejmaIf8KFsk69fpjnovoVpbmV4jfE9rHSKBAhkfmTm3Wji55QpB7QQoKPVCY8gFyQv/0WTlq4n3J1GDtW6dYzKp4IivYG+UeBBwnnqDPu2PB40LV2Ws3o6ZRQc2qqRcqkHnV9vtqjrkVkLkCi/pwqpyDYkLEIKc/kH5K95z34ZkiqrKkkVHLaYXGzDWVkWXd+XBBgSZ1LR/dGhudDia7wKB2LoUWh1FFeqtkRniLy+cOV2rL6qsWdO12d2mIu8E86DiuhtReW7YHiLfO182GJKYNL6UxAO5F4l1o4a6QV/fKeT8p2bP8zOHeZ+5T92MV5HvNZkEUUi6U6FKUlg5g8Hqy9CklhOgMYlf7Fn+QatS5cUWxJ2KG6IaD+fbUbnfjvwD4CKoYSBeD0/K8l+vEqDsnf2lScy3UtiJpPEOP+q3m1eipEw7vvA9j3C4lkYNsaxA81e9PD1907kiXIqOOMl6x5lIcc6XfWtLeJ0QqC67pi7hlPSCvaBrzonSYNh1c+0c7f/yUMr0nVvQl+lXrWhZiDBssg1F99uPnv8axf5rOlGrWBpKkMbkqKbGGOI3eZSoMFQWEsOzSqcdzZXStedD4csh0qKVyhS/F/lolGB37h3jL4RtGZIyxXx3JJGH1ZFYkpiomJAMZxs1ZtVEXBippRNEIsHw4GhvS2f/UK4Szppe3Y4bGssJ56jMyw2r1uPhcxZArZsHCRNbrh3gI6mcUQku/X9gF65ueRhzFal+Hgk8yJle4sGWoGgf61L3UG8OcUoWOnkMDbpTI9oJ9OgsK3UJmcbS7ergOio4f3lhUTj+gfTDt6BvJQebgsS3Kv/b1Y8veg7LuA8uLBEu/Lkimmv9CoBZsZ4qzL7omZRWVRcPsMbs/+a0vw8L2GvwpsLeO5J4LchRoiEdt3lmUAik7AcBtixU+z0gH7K/rS77p7VFwpzeCLXSWX1TsbRo6zxBeypK0/aukO07ARj/n2z9SDrurcQAE6h5TSgcVUlYo3ZVO1hkgLK2RVvtuHY3SqjbG8d3IMjCX5alV4F21bAJ9ENnbYQQxSXKLFBnvzBczZaICAtkYXNn/ppdyPT2bv94S7W4EzKlAOMQv2vWqxD/EiS+0rHkD6m2YQZ+RbfDQmY/QAEe3axsav9HMyR9z7gyprPEgfMls8J83KxQ3k8Kf/dXPYmokkDNz5hVw5+igT2lxoR/JVfS32t4a/sFo5rX5gJ03WCQZfAvQBx8LzKNKb4NUcOoS5xWkd8lAWI7cLmvC9U+nZ9qM+MENZL6nduXA96Z/elo5OAzFSZqxKLQUpG2bMo7REaxQZbOxOP+UYJJ4V+HQWb+sVuv6oJyxrrz+l8L8am10V0uhD9if9h3YklphGr4GhL4teJbC1pTEThGfc7N5B+pTR1KxsOxhlt1ACgKgiGyemgLhf0lF+qlPyrA3IZTUbV0uRXUk3pe4/jR/RuaxsaumaoPHKhw0VKyZVe2mP98If49+rgO0TOdVs5iKSZzJTEBMmSsdXLKS7dTPH/TeHy5f9aNN1SLfFdPNdMmyWUdC47N9VVjE6n+rEibAkx8mtpJN2BerhR5L+IfpBoUg68b8dSoQ2Ly6Ux3zCjfqahsX5ROz2l2Iwd8zvbeIr3HjjBghSg=';
  // const cookieDomain = 'localhost';
  // const cookiePath = '/'; 
  // const cookieData = `${cookieName}=${cookieValue}; path=${cookiePath}; domain=${cookieDomain}; SameSite=None; secure`;
  
  // // Set cookie via postMessage
  // console.log(cookieData);
  // window.parent.postMessage({ type: 'SET_COOKIE', cookieData }, 'http://localhost:3005');

  // const localStorageKey = 'localStorageKey';
  // const localStorageValue = 'localStorageValue11111';
  // const sessionStorageKey = 'sessionStorageKey';
  // const sessionStorageValue = 'sessionStorageValue222222';

  // // Set localStorage
  // localStorage.setItem(localStorageKey, localStorageValue);

  // // Set sessionStorage
  // sessionStorage.setItem(sessionStorageKey, sessionStorageValue);

  // // Log the operation
  // console.log(`localStorage: { ${localStorageKey}: ${localStorageValue} }`);
  // console.log(`sessionStorage: { ${sessionStorageKey}: ${sessionStorageValue} }`);
};
const validateUser = (token:any) => {
  try {
    // Decode the token
    const decodedToken:any = jwtDecode(token);

    // Check if the token has expired
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      console.error('Token has expired');
    } else {
      // Use the token data
      console.log('User ID:', decodedToken);
      history.push('/iframe-dashboard')
    }
  } catch (error) {
    console.error('Invalid token:', error);
  }
}
const registerClick = () => {
  const email = 'a.devasia@edexa.team'
  registerIframeUser({email})
      .then((res:any) => {
      console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
};

return (
  <><div>
    <button onClick={handleClick}>Login</button>
  </div><div>
      <button onClick={registerClick}>Register</button>
    </div></>
);
};
