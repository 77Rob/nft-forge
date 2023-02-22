import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { Provider } from "react-redux";
import store from "../store";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/userReducer";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import { mainnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Chain } from "wagmi";

export const { chains, provider } = configureChains(
  [
    {
      id: 5001,
      network: "mantle",
      rpcUrls: {
        public: { http: [""] },
        default: {
          http: ["https://rpc.testnet.mantle.xyz/"],
        },
      },
      name: "Mantle testnet",
      nativeCurrency: { name: "BIT", decimals: 18, symbol: "BIT" },
      testnet: true,
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://rpc.testnet.mantle.xyz/",
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: false,
  provider: provider,
});

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
    <WagmiConfig client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </WagmiConfig>
  );
}
