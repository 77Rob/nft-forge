import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { Provider } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import store from "../store";

export default function App({ Component, pageProps }: AppProps) {
  // https://github.com/saadeghi/theme-change
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      localStorage.setItem("userId", uuidv4());
    }
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />;
    </Provider>
  );
}
