import { Dashboard } from "../../Pages/Main/Dashboard";
import { Profile } from "../../Pages/Main/Profile";
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
  {
    path: "/:id",
    component: Profile
  },
];

export const publicRoutes = [
  {
    path: "/",
    component: Dashboard
  },
  {
    path: "/:id",
    component: Profile
  },
];
