import { createBrowserRouter } from "react-router";
import RootProviders from "../layout/RootProviders";
import Layout from "../layout/Layout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Info from "../pages/DataResults/DataResults";
import Start from "../pages/Start/Start";
import TarotResult from "../pages/TarotResults/TarotResult";
import History from "../pages/History/History";
import ProfileReading from "../pages/ProfileReading/ProfileReading";
import Loading from "../pages/Loading/Loading";
import VerifyAccount from "../pages/VerifyAccount/VerifyAccount";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Profile from "../pages/Profile/Profile";
import ConfirmDeleteAccount from "../pages/ConfirmDeleteAccount/ConfirmDeleteAccount";
import PrivateRoute from "./PrivateRoute";
import AskQuestion from "../pages/AskQuestion/AskQuestion";
import Intro from "../pages/Intro/Intro";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootProviders,
    children: [
      { index: true, Component: Loading },
      { path: "/intro", Component: Intro },
      { path: "/verify-account", Component: VerifyAccount },
      { path: "/forgot-password", Component: ForgotPassword },
      { path: "/reset-password", Component: ResetPassword },
      { path: "/confirm-delete-account", Component: ConfirmDeleteAccount },
      {
        Component: Layout,
        children: [
          // Públicas
          { path: "/home", Component: Home },
          { path: "/register", Component: Register },
          { path: "/info", Component: Info },

          //Privadas
          {
            Component: PrivateRoute,
            children: [
              { path: "/readings", Component: Start },
              { path: "/readings/question", Component: AskQuestion },
              { path: "/readings/board", Component: Start },
              { path: "/tarot-result", Component: TarotResult },
              { path: "/history", Component: History },
              { path: "/profile", Component: ProfileReading },
              { path: "/profile-settings", Component: Profile },
            ],
          },
        ],
      },
    ],
  },
]);
