import React, { useState, useEffect } from "react";
import styles from "./Dashboard_Tab.module.scss";
import Image from "next/image";
import {
  approveToken,
  getDashboardStats,
  getTokenBalance,
  getAllowance,
  withdraw,
  POOL_TOKENS,
} from "blockchain/utils";

const DashboardTab = (props) => {
  const { account, onWalletConnect, dashboardStats, setDashboardStats, tab } =
    props;
  const [amount, setAmount] = useState();
  const [selectedToken, setSelectedToken] = useState(
    POOL_TOKENS.find((token) => token.name === "palUNI")
  );
  const [tokenSelectOpen, setTokenSelectOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState();
  const [allowance, setAllowance] = useState(0);
  if (typeof window !== "undefined") {
    document.addEventListener("mouseup", function (e) {
      var popup = document.getElementById("popup");
      var openButton = document.getElementById("openButton");
      if (
        !popup.contains(e.target) &&
        tokenSelectOpen &&
        !openButton.contains(e.target)
      ) {
        setTokenSelectOpen(false);
      }
    });
  }

  const handleAmountChange = (e) => {
    if (e.target.value < 0) {
      setAmount(0);
    } else {
      setAmount(e.target.value);
    }
  };

  const getShareOfThePool = () => {
    if (tokenBalance === 0) return 0;

    if (dashboardStats !== undefined) {
      return (
        Math.round((dashboardStats.totalReserve / tokenBalance) * 100) / 100
      ).toFixed(1);
    }
  };

  const getButtonText = () => {
    if (!account) {
      return "CONNECT TO A WALLET";
    } else {
      return "WITHDRAW";
    }
  };

  const handleButtonClick = async () => {
    if (!account) {
      onWalletConnect();
    } else {
      if (tokenBalance > 0 && amount > 0 && amount <= tokenBalance) {
        await withdraw(selectedToken.pool, account, amount);
      }
    }
  };

  useEffect(() => {
    (async () => {
      setDashboardStats(await getDashboardStats(selectedToken.pool));
      setTokenBalance(await getTokenBalance(account, selectedToken.address));
      setAllowance(await getAllowance(selectedToken.address, account));
    })();
  }, [account, selectedToken, setDashboardStats]);

  return (
    <section
      className={styles.section}
      style={tab === "dashboard" ? { display: "flex" } : { display: "none" }}
    >
      <div className={styles.container}>
        <section className={styles.display}>
          Dashboard
          <section className={styles.brownBox}>
            <div className={styles.tokensRow}>
              <div className={styles.leftContainer}>
                <div className={styles.tokensSelector}>
                  <button
                    id="openButton"
                    className={styles.tokenButton}
                    onClick={() => setTokenSelectOpen((prev) => !prev)}
                  >
                    <Image
                      src={selectedToken.image}
                      width={27}
                      height={27}
                      layout="fixed"
                      alt={selectedToken.name.substring(3)}
                    />
                    <p className={styles.tokenButtonElement}>
                      {selectedToken.name.substring(3)}
                    </p>{" "}
                    <Image
                      src="/dropDownIcon.svg"
                      width={30}
                      height={30}
                      alt="arrow down"
                      style={
                        tokenSelectOpen
                          ? {
                              transform: "rotate(-90deg)",
                              transition: "transform .2s ease-in-out",
                            }
                          : {
                              transform: "rotate(0deg)",
                              transition: "transform .2s ease-in-out",
                            }
                      }
                    />
                    <div className={styles.icon}></div>
                  </button>
                  <div
                    id="popup"
                    className={styles.popUp}
                    style={
                      tokenSelectOpen
                        ? {}
                        : { visibility: "hidden", opacity: "0" }
                    }
                  >
                    {POOL_TOKENS.filter((token) => token !== selectedToken).map(
                      (token, index) => (
                        <button
                          key={index}
                          className={styles.tokenListButton}
                          onClick={() => {
                            setSelectedToken(token);
                            setTokenSelectOpen(false);
                          }}
                        >
                          <Image
                            src={token.image}
                            width={27}
                            height={27}
                            layout="raw"
                            alt={token.name.substring(3)}
                          />
                          <div className={styles.tokenListName}>
                            {token.name.substring(3)}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
                <button
                  className={styles.maxButton}
                  onClick={() => setAmount(tokenBalance)}
                >
                  MAX
                </button>
              </div>
              <div className={styles.rightContainer}>
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  minLength="1"
                  maxLength="79"
                  className={styles.input}
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <p className={styles.balance}>
              Balance: {tokenBalance} {selectedToken.name}
            </p>
          </section>
          <section className={styles.brownBox}>
            <div>
              <div className={styles.poolStatsTitle}>
                {" "}
                <p>Your Stats</p>
              </div>
              <div className={styles.poolStats}>
                Balance{" "}
                <p>
                  {tokenBalance !== undefined
                    ? (Math.round(tokenBalance * 1000) / 1000).toFixed(2) +
                      " " +
                      selectedToken.name +
                      " / " +
                      "$" +
                      (
                        Math.round(
                          selectedToken.price *
                            dashboardStats.totalBorrowed *
                            1000
                        ) / 1000
                      ).toFixed(2)
                    : "-"}
                </p>
              </div>
              <div className={styles.poolStats}>
                Conversion{" "}
                <p>
                  {dashboardStats?.conversion !== undefined
                    ? "1 " +
                      selectedToken.name +
                      " = " +
                      (
                        Math.round(dashboardStats.conversion * 100) / 100
                      ).toFixed(1) +
                      " " +
                      selectedToken.name.substring(3)
                    : "-"}
                </p>
              </div>
              <div className={styles.poolStats}>
                Your Share of the Pool
                <p>{getShareOfThePool() + "%"}</p>
              </div>
              <div className={styles.poolStats}>
                Current Borrow Rate
                <p>
                  {dashboardStats?.currentBorrowRate !== undefined
                    ? dashboardStats?.currentBorrowRate + "%"
                    : "-"}
                </p>
              </div>
            </div>
          </section>
          <button className={styles.mainButton} onClick={handleButtonClick}>
            {getButtonText()}
          </button>
        </section>
      </div>
    </section>
  );
};

export default DashboardTab;
