import { useState, useCallback } from "react";

const useHttp = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const sendRequestF = useCallback(async (requestConfig, applyDataF) => {
    try {
      setError(null);
      setStatus("pending");
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method || "GET",
        body: JSON.stringify(requestConfig.data) || null,
        header: requestConfig.headers || {},
      });
      if (!response.ok) {
        throw new Error("No Response From Server");
      }
      const data = await response.json();

      if (requestConfig.method === "GET") {
        applyDataF(data);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setStatus("completed");
  }, []);
  return { error, status, sendRequestF };
};

export default useHttp;
