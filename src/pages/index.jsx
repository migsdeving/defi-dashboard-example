import React, { useState } from "react";
import Head from "next/head";
import Nav from "components/nav";
import PoolTab from "components/poolTab";
import DashboardTab from "components/DashboardTab";
import TabSelector from "components/tabSelector";
import { connectWalletHandler } from "blockchain/utils";

export default function Home() {
  const [account, setAccount] = useState(undefined);
  const [ethBalance, setEthBalance] = useState(0);
  const [poolStats, setPoolStats] = useState(undefined);
  const [dashboardStats, setDashboardStats] = useState(undefined);
  const [tab, setTab] = useState("pool");

  const handleWalletConnect = async () => {
    let connection = await connectWalletHandler();
    if (connection != undefined) {
      setAccount(connection.account);
      setEthBalance(connection.ethBalance);
    }
  };

  return (
    <div className="home">
      <Head>
        <title>Paladin Technical Assessment</title>
        <meta
          name="description"
          content="Technical Assessment for the Junior Frontend Developer Position at Paladin"
        />
      </Head>
      <Nav
        account={account}
        onWalletConnect={handleWalletConnect}
        ethBalance={ethBalance}
        poolStats={poolStats}
        setPoolStats={setPoolStats}
      />

      <TabSelector tab={tab} setTab={setTab} />

      <PoolTab
        tab={tab}
        account={account}
        onWalletConnect={handleWalletConnect}
        ethBalance={ethBalance}
        poolStats={poolStats}
        setPoolStats={setPoolStats}
      />
      <DashboardTab
        tab={tab}
        account={account}
        onWalletConnect={handleWalletConnect}
        ethBalance={ethBalance}
        dashboardStats={dashboardStats}
        setDashboardStats={setDashboardStats}
      />
    </div>
  );
}
