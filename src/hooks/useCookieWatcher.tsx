import { useEffect, useState } from "react";

const cookies = () =>
  Object.fromEntries(
    document.cookie.split(";").map((it) => {
      const [key, value] = it.split("=");
      return [key.trim(), value];
    })
  );

const cookieExist = (cookie: string) => !!cookies()[cookie];

/**
 * This custom hook periodically checks wheather a cookie exist or not in browser storage.
 *
 * @param {string} cookie the name of the cookie to be watched
 * @param {number} pollingRate the interval to watch the cookie
 * @returns {boolean}
 */
const useAuthCookieWatcher = (cookie: string, pollingRate = 250) => {
  // state for cookie existence
  const [exist, setExist] = useState(cookieExist(cookie));

  useEffect(() => {
    const interval = setInterval(() => setExist(cookieExist(cookie)), pollingRate);
    return () => clearInterval(interval);
  });

  return { exist };
};

export default useAuthCookieWatcher;

// export const useCookie = (cookie) => cookies()[cookie];
