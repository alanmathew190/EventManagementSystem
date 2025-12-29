import { useEffect } from "react";
import api from "../api/axios";

export default function GoogleSuccess() {
  useEffect(() => {
    api
      .post("/auth/login/")
      .then((res) => {
        localStorage.setItem(
          "authTokens",
          JSON.stringify({
            access: res.data.access,
            refresh: res.data.refresh,
          })
        );

        window.location.href = "/";
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  return <p className="p-10">Signing you in…</p>;
}
