import { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import UserInfo from "./UserInfo.jsx";
import RegisterMemberQr from "./RegisterMemberQr.jsx";

export default function Accounts() {
  const userProgressStore = useContext(UserProgressContext);

  return (
    <div id="accounts-main">
      <Routes>
        <Route path="/" element={<UserInfo />} />
        <Route path="register" element={<RegisterMemberQr />} />
        <Route path="register/:familyId" element={<RegisterMemberQr />} />
      </Routes>
      <Outlet /> {/*중첩 라우트를 위한 Outlet 추가 */}
    </div>
  );
}
