import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { themeChange } from "theme-change";

export default function App({ Component, pageProps }: AppProps) {
  // https://github.com/saadeghi/theme-change
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  return <Component {...pageProps} />;
}
