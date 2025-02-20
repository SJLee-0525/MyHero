import "./Advertisement.css";

import { useRef, useState, useContext, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import AdverLogin from "../accounts/AdverLogin.jsx";

import logo from "../../../assets/advertisement/blue-logo.png";
import dh from "../../../assets/advertisement/dh.png";
import jin from "../../../assets/advertisement/jin.png";
import gyu from "../../../assets/advertisement/gyu.png";
import dy from "../../../assets/advertisement/dy.png";
import sh from "../../../assets/advertisement/sh.jpg";
import sj from "../../../assets/advertisement/sj.jpg";

export default function Advertisement() {
  const userProgressStore = useContext(UserProgressContext);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 720);

  const boxRef = useRef("");
  const memberTextRef = useRef("");
  const memberRef = useRef("");
  const boxRefs = useRef([]); // 여러 개의 요소를 참조할 배열 생성

  const names = [
    ["김도형", "BE/AI"],
    ["박  진", "BE/INFRA"],
    ["엄도윤", "EM/BG"],
    ["노규헌", "EM/AI"],
    ["형서희", "FE"],
    ["이성준", "FE"],
  ];

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
      <div className="top-box">
        <div className="title-box">
          <img src={logo} alt="" />
          <h2>영웅이네 오신 것을 환영합니다.</h2>
        </div>
        <div className="login-box">
          <AdverLogin />
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div id="video-group">
        <div className="video-box" ref={boxRef}>
          <iframe
            width={window.innerWidth * 0.6}
            height={window.innerWidth * 0.6 * (405 / 720)}
            src="https://www.youtube.com/embed/nEaJDWWXm5o?si=Albz6q2v2zitLmI5"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            // referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <h1 className="sub-title-h1">프로젝트 개요</h1>
      <div id="summary">
        <h3>
          영웅이네는 노인분들의 안전과 편의를 위해 음성 대화, 낙상 감지, 정보
          제공 등의 기능을 제공하는 AI 실버 케어 로봇 플랫폼입니다.
        </h3>
        <p>SSAFY 12기 공통 프로젝트</p>
        <p>서울 1반 A102</p>
        <p>2025. 01. 06. ~ 2025. 02. 21.</p>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <h1 className="sub-title-h1">영웅이를 만든 사람들</h1>
      <div id="image-group-box">
        <div className="image-group">
          {[dh, jin, dy, gyu, sh, sj].map((imgSrc, index) => (
            <div
              key={index}
              className="image-box"
              ref={(elem) => (boxRefs.current[index] = elem)} // 개별 요소를 배열에 저장
            >
              <img src={imgSrc} alt={`image-${index}`} />
              <div className="member-info">
                <h3>{names[index][0]}</h3>
                <p>{names[index][1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <h1 className="sub-title-h1">기술 스택</h1>
      <div id="stacks">
        <div className="stack">
          <h1>BACKEND</h1>
          <div className="backend">
            <div className="backend-stack">
              <h3>음성 대화</h3>
              <p>Google Cloud Speech</p>
              <p>Gtts</p>
              <p>OpenAI API</p>
            </div>

            <div className="backend-stack">
              <h3>낙상 감지</h3>
              <p>YOLOv8</p>
            </div>

            <div className="backend-stack">
              <h3>정보 제공</h3>
              <p>공공 API</p>
              <p>(날씨, 재난, 뉴스)</p>
            </div>

            <div className="backend-stack">
              <h3>API SERVER</h3>
              <p>FastAPI</p>
              <p>SQL-Alchemy</p>
              <p>bcrypt</p>
            </div>

            <div className="backend-stack">
              <h3>Infra</h3>
              <p>Nginx</p>
              <p>Docker</p>
              <p>Portainer</p>
              <p>Jenkins</p>
            </div>
          </div>
        </div>

        <div className="stack">
          <h1>EMBEDDED</h1>
          <div className="embedded">
            <div className="embedded-stack">
              <h3>자율주행</h3>
              <p>ROS1 noetic, Hector SLAM, ROS Navigation</p>
              <p>Global Planner: Hybrid A*</p>
              <p>Local Planner: DWA</p>
              <p>Recovery Behavior: Backoff, Clear map</p>
              <p>etcL Autonomous exploration</p>
            </div>
          </div>
        </div>

        <div className="stack">
          <h1>FRONTEND</h1>
          <div className="frontend">
            <div className="frontend-stack">
              <h3>웹 페이지</h3>
              <p>React</p>
              <p>GSAP</p>
              <p>Recharts</p>
              <p>qrcode.react</p>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
