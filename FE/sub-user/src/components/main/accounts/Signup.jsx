import "./Accounts.css";

import { useRef, useState } from "react";

import PageContainer from "../container/PageContainer.jsx";

export default function Signup() {
  const inputEmail = useRef("");

  const [emailCheck, setEmailCheck] = useState("");
  const [passwordAreNotEqual, setPasswordAreNotEqual] = useState(false);

  const regions = [
    {
      name: "서울",
      cities: [
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
      ],
    },
    {
      name: "경기",
      cities: [
        "수원시",
        "성남시",
        "고양시",
        "용인시",
        "부천시",
        "안산시",
        "안양시",
        "남양주시",
        "화성시",
        "평택시",
        "의정부시",
        "시흥시",
        "파주시",
        "김포시",
        "광주시",
        "군포시",
        "광명시",
        "이천시",
        "양주시",
        "오산시",
        "구리시",
        "안성시",
        "포천시",
        "의왕시",
        "하남시",
        "여주시",
      ],
    },
    {
      name: "인천",
      cities: [
        "계양구",
        "미추홀구",
        "남동구",
        "동구",
        "부평구",
        "서구",
        "연수구",
        "중구",
        "강화군",
        "옹진군",
      ],
    },
    {
      name: "경북",
      cities: [
        "포항시",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
        "상주시",
        "문경시",
        "경산시",
        "군위군",
        "의성군",
        "청송군",
        "영양군",
        "영덕군",
        "청도군",
        "고령군",
        "성주군",
        "칠곡군",
        "예천군",
        "봉화군",
        "울진군",
        "울릉군",
      ],
    },
    {
      name: "부산",
      cities: [
        "강서구",
        "금정구",
        "기장군",
        "남구",
        "동구",
        "동래구",
        "부산진구",
        "북구",
        "사상구",
        "사하구",
        "서구",
        "수영구",
        "연제구",
        "영도구",
        "중구",
        "해운대구",
      ],
    },
    {
      name: "대구",
      cities: [
        "남구",
        "달서구",
        "달성군",
        "동구",
        "북구",
        "서구",
        "수성구",
        "중구",
      ],
    },
    {
      name: "광주",
      cities: ["광산구", "남구", "동구", "북구", "서구"],
    },
    {
      name: "대전",
      cities: ["대덕구", "동구", "서구", "유성구", "중구"],
    },
    {
      name: "울산",
      cities: ["남구", "동구", "북구", "울주군", "중구"],
    },
    {
      name: "강원",
      cities: [
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
        "홍천군",
        "횡성군",
        "영월군",
        "평창군",
        "정선군",
        "철원군",
        "화천군",
        "양구군",
        "인제군",
        "고성군",
        "양양군",
      ],
    },
    {
      name: "충북",
      cities: [
        "청주시",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "증평군",
        "진천군",
        "괴산군",
        "음성군",
        "단양군",
      ],
    },
    {
      name: "충남",
      cities: [
        "천안시",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
        "당진시",
        "금산군",
        "부여군",
        "서천군",
        "청양군",
        "홍성군",
        "예산군",
        "태안군",
      ],
    },
    {
      name: "전북",
      cities: [
        "전주시",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
        "진안군",
        "무주군",
        "장수군",
        "임실군",
        "순창군",
        "고창군",
        "부안군",
      ],
    },
    {
      name: "전남",
      cities: [
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
        "구례군",
        "고흥군",
        "보성군",
        "화순군",
        "장흥군",
        "강진군",
        "해남군",
        "영암군",
        "무안군",
        "함평군",
        "영광군",
        "장성군",
        "완도군",
        "진도군",
        "신안군",
      ],
    },
    {
      name: "제주",
      cities: ["제주시", "서귀포시"],
    },
  ];

  function handleEmailCheck() {
    const enteredEmail = inputEmail.current.value;
    console.log("enteredEmail: " + enteredEmail);

    // 이메일 중복 확인 액션션
    setEmailCheck("verified");
    // setEmailCheck("not-verified");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);

    // 입력된 모든 값들을 그룹화
    const data = Object.fromEntries(fd.entries());
    console.log(data);

    if (emailCheck !== "verified") {
      console.log("이메일 중복확인 안 됨");
      return;
    }

    if (data.password !== data["confirm-password"]) {
      console.log(data.password);
      console.log(data["confirm-password"]);
      setPasswordAreNotEqual(true);
      return;
    }

    // 회원 가입 요청 액션
    console.log("요청!");
  }

  return (
    <PageContainer title="회원 가입">
      <form id="signup-form" onSubmit={handleSubmit}>
        <h2>영웅이 가입을 환영합니다.</h2>
        <p>블라블라</p>

        <div className="signup-control">
          <label htmlFor="email">Email</label>
          <div className="signup-wrapper">
            <input
              id="email"
              className="email-input"
              type="email"
              name="email"
              ref={inputEmail}
              required
            />
            {emailCheck === "" && (
              <button
                type="button"
                onClick={handleEmailCheck}
                className="email-check"
              >
                중복 확인
              </button>
            )}
            {emailCheck === "verified" && (
              <button type="button" className="email-verified" disabled>
                확인됨
              </button>
            )}
            {emailCheck === "not-verified" && (
              <button
                type="button"
                onClick={handleEmailCheck}
                className="email-not-verified"
              >
                중복 확인
              </button>
            )}
          </div>

          {emailCheck === "not-verified" && (
            <div className="signup-control-error">
              <p>이메일 중복 확인을 해 주세요.</p>
            </div>
          )}
        </div>

        <div className="signup-control-row">
          <div className="signup-control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </div>

          <div className="signup-control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              required
            />
            <div className="signup-control-error">
              {passwordAreNotEqual && <p>비밀번호가 일치하지 않습니다.</p>}
            </div>
          </div>
        </div>

        <hr />

        <div className="signup-control-row">
          <div className="signup-wrapper">
            <div className="signup-control">
              <label htmlFor="user_name">Name</label>
              <input type="text" id="user-name" name="user_name" required />
            </div>

            <div className="signup-control">
              <label htmlFor="birth_date">Birth Day</label>
              <input type="date" id="birth-date" name="birth_date" required />
            </div>
          </div>

          <div className="signup-control">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" required />
          </div>
        </div>

        <div className="signup-control-row">
          <div className="signup-wrapper">
            <div className="signup-control">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="signup-control">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" required>
                <option value="main">Main</option>
                <option value="sub">Sub</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="signup-btn">
          Sign up
        </button>
        <button type="reset" className="reset-btn">
          Reset
        </button>
      </form>
    </PageContainer>
  );
}
