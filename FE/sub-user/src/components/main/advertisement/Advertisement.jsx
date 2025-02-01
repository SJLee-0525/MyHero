import "./Advertisement.css"

import { useContext, useState, useEffect } from "react"

import { UserProgressContext } from "../../../store/userProgressStore.jsx"

import LoginModal from "./LoginModal.jsx"

import ad1 from "../../../assets/advertisement/ad1.png"

import mobileAd1 from "../../../assets/advertisement/mobile-ad1.png"

export default function Advertisement() {
  const userProgressStore = useContext(UserProgressContext)

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 720)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 720)
    }

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize)

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div id="advertisement">
      {isDesktop && (
        <div id="ad-main-header">
          <img src={ad1} alt="ad-main-img" />
          <div className="ad-main-header-text">
            <h1>
              실버 케어 로봇 서비스<br></br>영웅이네 오신 것을 환영합니다.
            </h1>
            <button onClick={() => userProgressStore.handleOpenModal("login")}>로그인하고 시작하기</button>
          </div>
        </div>
      )}
      {!isDesktop && (
        <div id="ad-main-header">
          <div className="ad-main-header-text">
            <h1>
              실버 케어 로봇 서비스<br></br>영웅이네 오신 것을 환영합니다.
            </h1>
            <button onClick={() => userProgressStore.handleOpenModal("login")}>로그인하고 시작하기</button>
          </div>
          <img src={mobileAd1} alt="mobile-ad-main-img" />
        </div>
      )}
      <h2>영웅이 이래서 특별합니다!</h2>
      <p>블ㄹ라블라..</p>

      <h2>영웅이 시연 영상</h2>
      <iframe
        width="720"
        height="405"
        src="https://www.youtube.com/embed/Lakekl1Ruig?si=gFVXBH47vGPKlki7"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

      <h2>생생한 영웅이 사용 후기!</h2>
      <p>- 정말 너무 좋아요 별 다섯개</p>
      <p>- 너무 안심ㅁ돼요!!! 짱ㅈ</p>

      <h2>상세 스펙</h2>

      {/* 모달 관련 */}
      <LoginModal />
    </div>
  )
}
