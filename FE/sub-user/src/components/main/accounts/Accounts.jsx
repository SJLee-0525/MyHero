import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import UserInfo from "./UserInfo.jsx";

export default function Accounts() {
  const userProgressStore = useContext(UserProgressContext);

  return (
    <div id="accounts-main">
      {userProgressStore.loginUserInfo.login ? <UserInfo /> : <Login />}
      {/* */}
      {/* <Signup /> */}
    </div>
  );
}
