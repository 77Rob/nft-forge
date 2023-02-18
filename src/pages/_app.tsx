import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { Provider } from "react-redux";
import store from "../store";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/userReducer";

export default function App({ Component, pageProps }: AppProps) {
  // https://github.com/saadeghi/theme-change
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      const uuid = uuidv4();
      localStorage.setItem("userId", uuid);
      createUser(uuid);
    }
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
