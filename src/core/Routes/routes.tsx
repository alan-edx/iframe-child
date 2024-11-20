import { Dashboard } from "../../Pages/Main/Dashboard";
import { Account } from "../../Pages/Main/accounts";
import { Search } from "../../Pages/Main/search";


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
