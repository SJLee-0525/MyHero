import "./Advertisement.css";

import { useRef, useState, useContext, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import LoginModal from "./LoginModal.jsx";

import ad1 from "../../../assets/advertisement/ad1.png";

import mobileAd1 from "../../../assets/advertisement/mobile-ad1.png";

// test
import ls from "../../../assets/advertisement/ls.webp";
import ms from "../../../assets/advertisement/ms.webp";
import nana from "../../../assets/advertisement/nana.webp";
import sora from "../../../assets/advertisement/sora.webp";
import yw from "../../../assets/advertisement/yw.webp";
import member from "../../../assets/advertisement/member.webp";

export default function Advertisement() {
  const userProgressStore = useContext(UserProgressContext);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 720);

  const boxRef = useRef("");
  const memberTextRef = useRef("");
  const memberRef = useRef("");
  const boxRefs = useRef([]); // 여러 개의 요소를 참조할 배열 생성

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 720);
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // gsap.fromTo()의 첫 번째 인자는 애니메이션을 적용할 요소, 두 번째와 세 번째 인자는 각각 초기 상태, 애니메이션 대상 상태를 넣어야 함.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (memberRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(memberRef.current, {
        scale: 1.5,
        duration: 2,
        scrollTrigger: {
          trigger: memberRef.current, // 트리거 요소 지정
          start: "top 70%",
          end: "top 35%", // 300px 스크롤 동안 확대
          scrub: true, // 스크롤에 따라 자연스럽게 변화
          pin: false, // 요소 고정하지 않음
          // onUpdate: (self) => {
          //   // 스크롤 위치에 맞춰 이미지 크기 조정
          //   const scaleValue = 1 + self.progress * 1 // 1부터 2까지 크기 조정
          //   gsap.set(memberRef.current, { scale: scaleValue })
          // },
        },
      });
    }

    if (memberTextRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(memberTextRef.current, {
        scale: 1.5,
        duration: 2,
        scrollTrigger: {
          trigger: memberTextRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: true,
          pin: false,
        },
      });
    }

    // 여러 개의 이미지 박스 애니메이션 적용
    boxRefs.current.forEach((box) => {
      gsap.fromTo(
        box,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    });

    // 비디오 박스 애니메이션 추가
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current, //
        { scale: 1, transformOrigin: "center center" }, // 기본 크기 유지
        {
          scale: 1.5,
          opacity: 1,
          y: 0,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: boxRef.current, // 트리거 요소
            start: "top 70%",
            end: "top 40%",
            scrub: true, // 스크롤과 함께 애니메이션 진행
          },
        }
      );
    }
  }, []);

  return (
    <div id="advertisement">
      {isDesktop && (
        <div id="ad-main-header">
          <img src={ad1} alt="ad-main-img" />
          <div className="ad-main-header-text">
            <h1>
              실버 케어 로봇 서비스<br></br>영웅이네 오신 것을 환영합니다.
            </h1>
            <button onClick={() => userProgressStore.handleOpenModal("login")}>
              로그인하고 시작하기
            </button>
          </div>
        </div>
      )}
      {!isDesktop && (
        <div id="ad-main-header">
          <div className="ad-main-header-text">
            <h1>
              실버 케어 로봇 서비스<br></br>영웅이네 오신 것을 환영합니다.
            </h1>
            <button onClick={() => userProgressStore.handleOpenModal("login")}>
              로그인하고 시작하기
            </button>
          </div>
          <img src={mobileAd1} alt="mobile-ad-main-img" />
        </div>
      )}

      <div id="big-container">
        <div className="image-box" ref={memberRef}>
          <h2>영웅이를 소개합니다!!</h2>
          <img src={member} alt="" />
        </div>
      </div>

      <h2>영웅이 이래서 특별합니다!</h2>
      <p>블ㄹ라블라..</p>

      <div id="image-group">
        <h2 ref={memberTextRef}>영웅이를 만든 사람들</h2>
        {[ls, ms, yw, nana, sora].map((imgSrc, index) => (
          <div
            key={index}
            className="image-box"
            ref={(el) => (boxRefs.current[index] = el)} // 개별 요소를 배열에 저장
          >
            <img src={imgSrc} alt={`image-${index}`} />
          </div>
        ))}
      </div>
      <div id="video-group">
        <div className="video-box" ref={boxRef}>
          <h2>영웅이 시연 영상</h2>
          <iframe
            width="720"
            height="405"
            src="https://www.youtube.com/embed/Lakekl1Ruig?si=kAgIWZEA251GJys0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            // referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <h2>생생한 영웅이 사용 후기!</h2>
      <p>- 정말 너무 좋아요 별 다섯개</p>
      <p>- 너무 안심ㅁ돼요!!! 짱ㅈ</p>
      <h2>상세 스펙</h2>
      {/* 모달 관련 */}
      <LoginModal />
    </div>
  );
}
