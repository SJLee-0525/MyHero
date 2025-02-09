import { useState, useCallback } from "react";
import { getEnvironments } from "../store/environmentsStore";

export function useMainHttp() {
  const BASE_URL = getEnvironments("API_URL") || import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);

      try {
        const url = `${BASE_URL}${endpoint}`; // API URL
        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          credentials: "include", // 필요한 경우 포함
        });

        console.log("hook:", response);
        const resData = await response.json().catch(() => null); // JSON 변환 실패 방지

        if (!response.ok) {
          if (response.status === 403) {
            console.error("세션 만료", response.error);
            sessionStorage.removeItem("loginUserInfo");
            window.location.href = "/";
            return {
              success: false,
              error: {
                type: response.status,
                message: "세션이 만료되었습니다. 다시 로그인해주세요.",
              },
              data: null,
            };
          }
          return {
            success: false,
            error: resData?.detail || "요청 실패",
            data: null,
          };
        }

        return { success: true, data: resData };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message, data: null };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
}