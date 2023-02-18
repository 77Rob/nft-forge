import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/Header";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { Provider } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import store from "../store";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/userReducer";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
