import { Dashboard } from "../../Pages/Main/Dashboard";
import { Account } from "../../Pages/Main/accounts";
import { Search } from "../../Pages/Main/search";
import { IframeDashboard } from "../../Pages/Main/IframeDashboard";


export const privateRoutes = [
  {
    path: "/account",
    component: Account
  },
    {
    path: "/search",
    component: Search
  },
];

export const publicRoutes = [
  {
    path: "/",
    component: Dashboard
  },
];

export const iframeRoutes = [
  {
    path:"/iframe-account",
    component: IframeDashboard
  }
]