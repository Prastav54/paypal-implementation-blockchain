/* eslint-disable react/prop-types */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from "web3uikit";
import { Layout } from "../components/layout";
import { App as AntdApp, Button, ConfigProvider } from "antd";
import { antdThemeConfig } from "../config/antd";
import { LoadingOutlined } from "@ant-design/icons";

const ErrorFallback = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong</h2>
      <Button type="primary" href={window.location.origin}>
        Refresh
      </Button>
    </div>
  );
};

const InProgressComponent = () => {
  return (
    <div className="flex h-full items-center justify-center gap-x-1.5 p-[100px]">
      <LoadingOutlined />
      <span>Loading...</span>
    </div>
  );
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: import.meta.env.VITE_SUBGRAPH_URL,
});

export const AppProvider = ({ children }) => {
  return (
    <React.Suspense fallback={<InProgressComponent />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MoralisProvider initializeOnMount={false}>
          <ApolloProvider client={client}>
            <NotificationProvider>
              <ConfigProvider theme={antdThemeConfig}>
                <AntdApp>
                  <Router>
                    <Layout>{children}</Layout>
                  </Router>
                </AntdApp>
              </ConfigProvider>
            </NotificationProvider>
          </ApolloProvider>
        </MoralisProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
