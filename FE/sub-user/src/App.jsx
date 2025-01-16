import "./App.css";

import { useState } from "react";

import TopNav from "./components/nav/TopNav";
import SideNav from "./components/nav/SideNav";
import Main from "./components/main/Main";

function App() {
  return (
    <div id="app">
      <nav id="top-nav">
        <TopNav />
      </nav>
      <nav id="side-nav">
        <SideNav />
      </nav>

      <main id="main-page">
        <Main />
      </main>
    </div>
  );
}

export default App;
