import { useState, useCallback } from "react";

export function useHttp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          credentials: "include", // 필요한 경우 포함
        });

        const resData = await response.json().catch(() => null); // JSON 변환 실패 방지
        // console.log("hook:", resData);

        if (!response.ok) {
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
