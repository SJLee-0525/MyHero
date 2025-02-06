import { useState } from "react";

export default function BackgroundChanger() {
  const [bg, setBg] = useState("");

  return (
    <div
      className="h-screen flex flex-col items-center justify-center transition-all duration-500"
      style={{ background: bg || "#f0f0f0" }}
    >
      <input
        type="text"
        placeholder="배경 색상 또는 이미지 URL 입력"
        className="p-2 border rounded-lg"
        onChange={(e) => setBg(e.target.value)}
      />
      <p className="mt-4 text-gray-700">예: red, #ff0000, url('이미지주소')</p>
    </div>
  );
}
