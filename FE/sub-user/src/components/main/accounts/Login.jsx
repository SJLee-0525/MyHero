import "./Accounts.css";

import { useState } from "react";

import PageContainer from "../container/PageContainer.jsx";

export default function Login() {
  return (
    <PageContainer title="로그인">
      <form id="login-form">
        <div className="login-form-row">
          <div className="login-control">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" />
          </div>

          <div className="login-control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" />
          </div>
        </div>

        <p className="login-form-action">
          <button className="login-btn">Login</button>
        </p>
      </form>
    </PageContainer>
  );
}
