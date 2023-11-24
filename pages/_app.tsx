import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import { Auth0Provider } from "@auth0/auth0-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain="dev-83zcj1w1daq5x7sc.us.auth0.com"
      clientId="wsu0nOFxC161ebKFh18F0qb8mEMZi7dl"
      authorizationParams={{ redirect_uri: "http://localhost:3000" }}
    >
      <MetaMaskUIProvider
        sdkOptions={{
          dappMetadata: {
            name: "Social Hub",
          },
        }}
      >
        <Component {...pageProps} />
      </MetaMaskUIProvider>
    </Auth0Provider>
  );
}
